import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CsvUpload } from './components/csv-upload/csv-upload';
import { BudgetTable } from './components/budget-table/budget-table';
import { TransactionDetails } from './components/transaction-details/transaction-details';
import { SheetSelector } from './components/sheet-selector/sheet-selector';
import { ParsedCsvData, BudgetRow, TransactionDetail } from './models/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleAuthService } from '../../../services/google-auth.service';
import { GoogleSheetsService } from './services/google-sheets.service';
import { CsvParserService } from './services/csv-parser.service';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Component({
  selector: 'app-economic',
  standalone: true,
  imports: [CsvUpload, BudgetTable, TransactionDetails, SheetSelector, CommonModule, FormsModule],
  templateUrl: './economic.component.html',
  styleUrls: ['./economic.component.scss']
})
export class EconomicComponent implements OnInit {
  authService = inject(GoogleAuthService);
  sheetsService = inject(GoogleSheetsService);
  csvParser = inject(CsvParserService);
  cdr = inject(ChangeDetectorRef);

  /** Drives the connect-Sheets gate UI; the real state lives in authService.hasSheetsAccess. */
  sheetsAccessStatus$ = new BehaviorSubject<'idle' | 'requesting' | 'denied'>('idle');

  /** True while transactions are being fetched from Google Sheets (initial load, sheet switch, or account switch). */
  isLoadingData$ = new BehaviorSubject<boolean>(false);

  allTransactions: TransactionDetail[] = [];
  incomeData: BudgetRow[] = [];
  expenseData: BudgetRow[] = [];
  disposableIncomeData: BudgetRow[] = [];

  availableYears: number[] = [];
  selectedYear: number | null = null;

  selectedDetails: {
    category: string;
    month: string;
    source: 'income' | 'expense' | 'disposable';
  } | null = null;

  syncStatus$ = new BehaviorSubject<'idle' | 'syncing' | 'success' | 'error'>('idle');

  ngOnInit(): void {
    // Loading transaction data needs three things to all be true: basic
    // login, the Sheets/Drive scopes (requested separately, see
    // connectSheets()), and a linked sheet ID. These used to be two
    // separate subscriptions (auth+access state, and sheet ID changes)
    // racing independently — whichever settled last would only trigger a
    // reload if the *other* one had already happened to resolve by then,
    // so on a live account/sheet switch the load could silently no-op
    // and never retry (a page refresh "fixed" it only because a full
    // reload restores everything synchronously from localStorage in one
    // go, sidestepping the race). Combining all three into one stream
    // means the load fires exactly once all three are actually ready,
    // regardless of which one resolves last.
    combineLatest([
      this.authService.isAuthenticated,
      this.authService.hasSheetsAccess,
      this.sheetsService.sheetIdChanged,
    ]).subscribe(async ([isAuthenticated, hasSheetsAccess, sheetId]) => {
      if (!isAuthenticated || !hasSheetsAccess || !sheetId) {
        // Not ready yet, or switched to an account/sheet with nothing
        // linked — clear out whatever was previously displayed so a
        // different account's budget doesn't linger on screen.
        this.resetBudgetData();
        return;
      }

      this.isLoadingData$.next(true);
      try {
        await this.loadInitialData();
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        this.isLoadingData$.next(false);
      }
    });
  }

  private resetBudgetData(): void {
    this.allTransactions = [];
    this.incomeData = [];
    this.expenseData = [];
    this.disposableIncomeData = [];
    this.availableYears = [];
    this.selectedYear = null;
    this.selectedDetails = null;
    this.cdr.markForCheck();
  }

  /**
   * Requests the Sheets/Drive scopes as a second consent step — called
   * from a click in the template so the OAuth popup isn't blocked.
   */
  async connectSheets(): Promise<void> {
    this.sheetsAccessStatus$.next('requesting');
    const granted = await this.authService.requestSheetsAccess();
    this.sheetsAccessStatus$.next(granted ? 'idle' : 'denied');
  }

  /**
   * Recalculate budget data when year is selected
   */
  onYearSelected(): void {
    if (!this.selectedYear) {
      return;
    }

    if (this.allTransactions.length === 0) {
      return;
    }

    this.recalculateBudgetForYear(this.selectedYear);
  }

  /**
   * Recalculate budget tables for specific year
   */
  private recalculateBudgetForYear(year: number | string): void {
    try {
      const yearNum = typeof year === 'string' ? parseInt(year) : year;

      const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const income: BudgetRow[] = [];
      const expenses: BudgetRow[] = [];

      // Filter and aggregate transactions for this year
      const yearTransactions = this.allTransactions.filter((t) => {
        const dateArray = t.date.split('.');
        const txYear = parseInt(dateArray[2] || '0');
        return txYear === yearNum;
      });

      for (const transaction of yearTransactions) {
        const amount = transaction.amount;
        const category = transaction.mainCategory || 'Unknown';
        const month = transaction.month || 'Unknown';

        const targetArray = amount >= 0 ? income : expenses;
        let existing = targetArray.find((i) => i.category === category);

        if (!existing) {
          const newEntry: BudgetRow = { category };
          MONTH_NAMES.forEach((m) => (newEntry[m] = 0));
          targetArray.push(newEntry);
          existing = newEntry;
        }

        existing[month] = Number(existing[month] || 0) + Number(amount);
      }

      // Add totals
      this.addTotalsAndAverages(income);
      this.addTotalsAndAverages(expenses);

      // Calculate disposable for this year
      const disposable: BudgetRow = { category: 'Disposable Income' };
      MONTH_NAMES.forEach((month) => {
        const totalIncome = income.reduce((sum, row) => sum + Number(row[month] || 0), 0);
        const totalExpenses = expenses.reduce((sum, row) => sum + Number(row[month] || 0), 0);
        disposable[month] = totalIncome + totalExpenses;
      });
      this.addTotalsAndAverages([disposable]);

      // Update budget data
      this.incomeData = income;
      this.expenseData = expenses;
      this.disposableIncomeData = [disposable];

      this.cdr.markForCheck();
    } catch (error) {
      console.error(`[Economic] ERROR in recalculateBudgetForYear:`, error);
      // Reset to empty data on error
      this.incomeData = [];
      this.expenseData = [];
      this.disposableIncomeData = [];
      this.cdr.markForCheck();
    }
  }

  /**
   * Load initial transactions from Google Sheets on app startup
   */
  private async loadInitialData(): Promise<void> {
    try {
      const sheetId = this.sheetsService.getSheetId();

      if (!sheetId) {
        return;
      }

      // Ensure headers exist before loading transactions
      await this.sheetsService.ensureHeaders(sheetId);

      // Load transactions from Google Sheets
      const loadedTransactions = await this.sheetsService.loadTransactions(sheetId);

      if (loadedTransactions.length > 0) {
        // Merge with current transactions
        this.allTransactions = this.mergeTransactions(this.allTransactions, loadedTransactions);

        // Re-aggregate data
        this.aggregateTransactions();
      } else {
        // Even if no transactions, reset UI data
        this.allTransactions = [];
        this.incomeData = [];
        this.expenseData = [];
        this.disposableIncomeData = [];
        this.availableYears = [];
        this.selectedYear = null;
      }

      // Force Angular to detect changes
      this.cdr.markForCheck();

      // Recalculate budget for selected year
      if (this.selectedYear) {
        this.onYearSelected();
      }
    } catch (error) {
      console.error('[Economic] Error loading initial data:', error);
    }
  }

  /**
   * Merge transactions, avoiding duplicates by timestamp
   */
  private mergeTransactions(
    current: TransactionDetail[],
    loaded: TransactionDetail[]
  ): TransactionDetail[] {
    const existingKeys = new Set(
      current.map((t) => `${t.date}|${t.title}|${t.amount}|${t.mainCategory}`)
    );
    const newOnes = loaded.filter(
      (t) => !existingKeys.has(`${t.date}|${t.title}|${t.amount}|${t.mainCategory}`)
    );
    return [...current, ...newOnes];
  }

  /**
   * Re-aggregate transactions directly (without re-parsing numbers)
   * This avoids the double-parsing bug when reloading from Google Sheets
   */
  private aggregateTransactions(): void {
    if (this.allTransactions.length === 0) return;

    const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const income: BudgetRow[] = [];
    const expenses: BudgetRow[] = [];
    const years = new Set<number>();

    // Direct aggregation without re-parsing
    for (const transaction of this.allTransactions) {
      const amount = transaction.amount; // Already a number, don't re-parse!
      const category = transaction.mainCategory || 'Unknown';
      const month = transaction.month || 'Unknown';

      // Extract year from date string (format: DD.MM.YYYY)
      const dateArray = transaction.date.split('.');
      const year = parseInt(dateArray[2] || '0');
      if (year > 0) years.add(year);

      // Find or create category entry
      const targetArray = amount >= 0 ? income : expenses;
      let existing = targetArray.find((i) => i.category === category);

      if (!existing) {
        const newEntry: BudgetRow = { category };
        MONTH_NAMES.forEach((m) => (newEntry[m] = 0));
        targetArray.push(newEntry);
        existing = newEntry;
      }

      // Add amount to month (convert to number to ensure it's numeric)
      existing[month] = Number(existing[month] || 0) + Number(amount);
    }

    // Add totals and averages
    this.addTotalsAndAverages(income);
    this.addTotalsAndAverages(expenses);

    // Calculate disposable income
    const disposable: BudgetRow = { category: 'Disposable Income' };
    const MONTH_NAMES_CONST = MONTH_NAMES;
    MONTH_NAMES_CONST.forEach((month) => {
      const totalIncome = income.reduce((sum, row) => sum + Number(row[month] || 0), 0);
      const totalExpenses = expenses.reduce((sum, row) => sum + Number(row[month] || 0), 0);
      disposable[month] = totalIncome + totalExpenses;
    });
    this.addTotalsAndAverages([disposable]);

    // Add total rows
    const totalIncome: BudgetRow = { category: 'Total Income' };
    MONTH_NAMES_CONST.forEach((month) => {
      totalIncome[month] = income.reduce((sum, row) => sum + Number(row[month] || 0), 0);
    });
    this.addTotalsAndAverages([totalIncome]);
    income.push(totalIncome);

    const totalExpenses: BudgetRow = { category: 'Total Expenses' };
    MONTH_NAMES_CONST.forEach((month) => {
      totalExpenses[month] = expenses.reduce((sum, row) => sum + Number(row[month] || 0), 0);
    });
    this.addTotalsAndAverages([totalExpenses]);
    expenses.push(totalExpenses);

    this.incomeData = income;
    this.expenseData = expenses;
    this.disposableIncomeData = [disposable];
    this.availableYears = Array.from(years).sort().reverse();
    this.selectedYear = this.availableYears.at(-1) ?? null;

    // Force change detection after aggregation
    this.cdr.markForCheck();
  }

  /**
   * Add totals and averages to budget rows
   */
  private addTotalsAndAverages(entries: BudgetRow[]): void {
    const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    entries.forEach((entry) => {
      const total = MONTH_NAMES.reduce((sum, m) => sum + Number(entry[m] || 0), 0);
      entry['Total'] = parseFloat(total.toFixed(2));
      entry['Average'] = parseFloat((total / 12).toFixed(2));
    });
  }

  /**
   * Handle CSV parse completion
   */
  handleCsvParsed(parsed: ParsedCsvData) {
    // Merge loaded transactions with newly parsed ones
    this.allTransactions = this.mergeTransactions(this.allTransactions, parsed.transactions);

    // Re-aggregate from the full merged transaction list, not just the
    // newly uploaded file — otherwise previously loaded data disappears
    // from view until the next reload re-fetches everything from Sheets.
    this.aggregateTransactions();

    // Recalculate budget for selected year (programmatic selection doesn't trigger (change) event)
    this.onYearSelected();
  }

  /**
   * Sync transactions to Google Sheets
   */
  syncTransactionsToSheet(transactions: TransactionDetail[]): void {
    const canSync =
      this.authService.isCurrentlyAuthenticated() &&
      this.authService.isCurrentlySheetsAccessGranted();

    if (!canSync) {
      console.warn('[Economic] Not authenticated or missing Sheets access. Skipping sync.');
      return;
    }

    this.syncStatus$.next('syncing');

    this.performSync(transactions);
  }

  /**
   * Perform the actual sync (separate method to avoid async issues)
   */
  private async performSync(transactions: TransactionDetail[]): Promise<void> {
    try {
      let sheetId = this.sheetsService.getSheetId();

      // If no sheet exists, create one
      if (!sheetId) {
        sheetId = await this.sheetsService.initializeSheet();
      }

      // Append transactions to sheet
      await this.sheetsService.appendTransactions(transactions, sheetId);

      // Create year sheets with budget tables
      try {
        await this.sheetsService.addYearSheets(
          sheetId,
          this.allTransactions,
          this.incomeData,
          this.expenseData,
          this.disposableIncomeData
        );
      } catch (error) {
        console.warn('[Economic] Warning: Could not create year sheets:', error);
        // Don't fail the entire sync if year sheets fail
      }

      this.syncStatus$.next('success');

      // Force change detection after sync
      this.cdr.markForCheck();

      // Reset status after 3 seconds
      setTimeout(() => {
        if (this.syncStatus$.value === 'success') {
          this.syncStatus$.next('idle');
        }
      }, 3000);
    } catch (error) {
      console.error('[Economic] Failed to sync transactions:', error);
      this.syncStatus$.next('error');
      this.cdr.markForCheck();
    }
  }

  get filteredTransactions(): TransactionDetail[] {
    if (!this.selectedYear) return [];
    const yearNum = typeof this.selectedYear === 'string' ? parseInt(this.selectedYear) : this.selectedYear;
    return this.allTransactions.filter(
      (t) => new Date(t.date.split('.').reverse().join('-')).getFullYear() === yearNum
    );
  }

  onCellClick(details: { category: string; month: string; source: 'income' | 'expense' | 'disposable' }) {
    this.selectedDetails = details;
  }

  onCloseDetails() {
    this.selectedDetails = null;
  }
}
