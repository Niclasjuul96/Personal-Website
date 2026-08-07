import { Injectable, inject } from '@angular/core';
import { GoogleAuthService } from '../../../../services/google-auth.service';
import { SHEET_CONFIG } from '../../../../constants/google-config';
import { TransactionDetail, BudgetRow } from '../models/types';
import { BehaviorSubject } from 'rxjs';

interface GoogleSheetsRange {
  range: string;
  majorDimension: string;
  values: any[][];
}

@Injectable({
  providedIn: 'root',
})
export class GoogleSheetsService {
  private authService = inject(GoogleAuthService);
  private sheetId: string | null = null;
  private sheetId$ = new BehaviorSubject<string | null>(null);

  sheetIdChanged = this.sheetId$.asObservable();

  constructor() {
    this.loadSheetId();
  }

  /**
   * Load sheet ID from localStorage (user's sheet)
   */
  private loadSheetId(): void {
    this.sheetId = localStorage.getItem(SHEET_CONFIG.STORAGE_KEY);
    this.sheetId$.next(this.sheetId);
  }

  /**
   * Save sheet ID to localStorage
   */
  private saveSheetId(id: string): void {
    this.sheetId = id;
    localStorage.setItem(SHEET_CONFIG.STORAGE_KEY, id);
    this.sheetId$.next(id);
  }

  /**
   * Get current sheet ID
   */
  getSheetId(): string | null {
    return this.sheetId;
  }

  /**
   * Set sheet ID manually (for linking existing sheets)
   */
  setSheetId(id: string): void {
    this.saveSheetId(id);
  }

  /**
   * Clear sheet ID
   */
  clearSheetId(): void {
    this.sheetId = null;
    localStorage.removeItem(SHEET_CONFIG.STORAGE_KEY);
    this.sheetId$.next(null);
  }

  /**
   * Initialize or create a new Google Sheet for the user
   * Creates a blank sheet with headers if it doesn't exist
   */
  async initializeSheet(sheetName?: string): Promise<string> {
    const token = this.authService.getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const name = sheetName || 'E-conomic Budget';

    // Create a new spreadsheet
    const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: name,
          autoRecalc: 'ON_CHANGE',
        },
        sheets: [
          {
            properties: {
              sheetId: 0,
              title: SHEET_CONFIG.TRANSACTIONS_SHEET_NAME,
            },
          },
        ],
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(`Failed to create sheet: ${error.error?.message}`);
    }

    const spreadsheet = await createResponse.json();
    const spreadsheetId = spreadsheet.spreadsheetId;

    // Save the sheet ID
    this.saveSheetId(spreadsheetId);

    // Add headers to the sheet
    await this.addHeaderRow(spreadsheetId);

    console.log('[GoogleSheets] Sheet created:', spreadsheetId);
    return spreadsheetId;
  }

  /**
   * Check if sheet has headers and add them if missing
   */
  async ensureHeaders(spreadsheetId?: string): Promise<void> {
    const id = spreadsheetId || this.sheetId;
    if (!id) {
      throw new Error('No sheet ID provided');
    }

    const token = this.authService.getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    try {
      // Check if headers exist
      const range = `${SHEET_CONFIG.TRANSACTIONS_SHEET_NAME}!A1:H1`;
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${encodeURIComponent(range)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to check headers: ${error.error?.message}`);
      }

      const data = await response.json();
      const existingHeaders = data.values?.[0] || [];

      console.log('[GoogleSheets] Existing headers:', existingHeaders);
      console.log('[GoogleSheets] Expected headers:', SHEET_CONFIG.HEADERS);

      // Check if headers match
      const headersMatch = 
        existingHeaders.length === SHEET_CONFIG.HEADERS.length &&
        existingHeaders.every((h: string, i: number) => h === SHEET_CONFIG.HEADERS[i]);

      if (!headersMatch) {
        console.log('[GoogleSheets] Headers missing or incorrect. Adding headers...');
        await this.addHeaderRow(id);
        console.log('[GoogleSheets] ✓ Headers added successfully');
      } else {
        console.log('[GoogleSheets] ✓ Headers already exist');
      }
    } catch (error) {
      console.error('[GoogleSheets] Error ensuring headers:', error);
      throw error;
    }
  }
  private async addHeaderRow(spreadsheetId: string): Promise<void> {
    const token = this.authService.getAccessToken();
    if (!token) throw new Error('User not authenticated');

    const range = `${SHEET_CONFIG.TRANSACTIONS_SHEET_NAME}!A${SHEET_CONFIG.HEADER_ROW_NUMBER}`;
    const values = [SHEET_CONFIG.HEADERS];

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=RAW`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values }),
      }
    );
  }

  /**
   * Load all transactions from the sheet
   */
  async loadTransactions(spreadsheetId?: string): Promise<TransactionDetail[]> {
    const id = spreadsheetId || this.sheetId;
    if (!id) {
      throw new Error('No sheet ID provided');
    }

    const token = this.authService.getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    try {
      // Read all data from the Transactions sheet
      const range = `${SHEET_CONFIG.TRANSACTIONS_SHEET_NAME}!A${SHEET_CONFIG.HEADER_ROW_NUMBER + 1}:Z`;
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${encodeURIComponent(range)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to load transactions: ${error.error?.message}`);
      }

      const data: GoogleSheetsRange = await response.json();
      const rows = data.values || [];

      // Convert rows to TransactionDetail objects
      const transactions = rows.map((row) => ({
        date: row[0] || '',
        title: row[1] || '',
        amount: parseFloat(row[2]) || 0,
        mainCategory: row[3] || '',
        subCategory: row[4] || '',
        month: row[5] || '',
      }));

      console.log(`[GoogleSheets] Loaded ${transactions.length} transactions`);
      return transactions;
    } catch (error) {
      console.error('[GoogleSheets] Error loading transactions:', error);
      throw error;
    }
  }

  /**
   * Parse a "DD.MM.YYYY" transaction date string into a real Date.
   * Sheet dates are stored as plain text (valueInputOption=RAW skips
   * Sheets' own date parsing), and day-first text doesn't sort
   * chronologically as a string, so this is needed to sort correctly.
   */
  private parseTransactionDate(dateStr: string): Date {
    return new Date(dateStr.split('.').reverse().join('-'));
  }

  /**
   * Merge new transactions into the sheet, deduplicated and sorted
   * chronologically. Rewrites the whole data range rather than using
   * Sheets' append (which always tacks rows onto the bottom in whatever
   * order they arrive, regardless of date) — that's what previously left
   * the Transactions tab unsorted after every import.
   */
  async appendTransactions(transactions: TransactionDetail[], spreadsheetId?: string): Promise<void> {
    console.log('[GoogleSheets] appendTransactions called');

    const id = spreadsheetId || this.sheetId;
    console.log('[GoogleSheets] Using sheet ID:', id);

    if (!id) {
      throw new Error('No sheet ID provided');
    }

    if (transactions.length === 0) {
      console.log('[GoogleSheets] No transactions to append');
      return;
    }

    const token = this.authService.getAccessToken();
    console.log('[GoogleSheets] Access token available:', !!token);

    if (!token) {
      throw new Error('User not authenticated');
    }

    try {
      // First, load existing transactions to check for duplicates
      console.log('[GoogleSheets] Loading existing transactions to check for duplicates...');
      let existingTransactions: TransactionDetail[] = [];
      try {
        existingTransactions = await this.loadTransactions(id);
      } catch (error) {
        console.log('[GoogleSheets] Could not load existing transactions (might be first upload):', error);
      }

      // Create a set of existing transaction keys for deduplication
      const existingKeys = new Set(
        existingTransactions.map(
          (t) => `${t.date}|${t.title}|${t.amount}|${t.mainCategory}`
        )
      );

      console.log('[GoogleSheets] Found', existingTransactions.length, 'existing transactions');

      // Filter out duplicates
      const newTransactions = transactions.filter((t) => {
        const key = `${t.date}|${t.title}|${t.amount}|${t.mainCategory}`;
        return !existingKeys.has(key);
      });

      console.log('[GoogleSheets] After deduplication:', newTransactions.length, 'new transactions to add');

      if (newTransactions.length === 0) {
        console.log('[GoogleSheets] ⓘ All transactions are duplicates. Nothing to add.');
        return;
      }

      // Merge with existing rows and sort chronologically, so the sheet
      // stays organized by date instead of new imports landing at the
      // bottom out of order.
      const merged = [...existingTransactions, ...newTransactions].sort(
        (a, b) => this.parseTransactionDate(a.date).getTime() - this.parseTransactionDate(b.date).getTime()
      );

      // Convert transactions to row format
      const timestamp = new Date().toISOString();
      const values = merged.map((t) => [
        t.date,
        t.title,
        t.amount,
        t.mainCategory,
        t.subCategory,
        t.month,
        this.parseTransactionDate(t.date).getFullYear(),
        timestamp,
      ]);

      const range = `${SHEET_CONFIG.TRANSACTIONS_SHEET_NAME}!A${SHEET_CONFIG.HEADER_ROW_NUMBER + 1}`;
      console.log('[GoogleSheets] Writing sorted range:', range, '(', values.length, 'total rows )');

      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${encodeURIComponent(range)}?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('[GoogleSheets] API error response:', error);
        throw new Error(`Failed to write transactions: ${error.error?.message}`);
      }

      const result = await response.json();
      console.log('[GoogleSheets] ✓ Added', newTransactions.length, 'transactions, rewrote', values.length, 'total rows in date order. Response:', result);
    } catch (error) {
      console.error('[GoogleSheets] ✗ Error writing transactions:', error);
      throw error;
    }
  }

  /**
   * Get metadata about the sheet (useful for checking if it exists)
   */
  async getSheetMetadata(spreadsheetId: string): Promise<any> {
    const token = this.authService.getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get sheet metadata: ${error.error?.message}`);
    }

    return response.json();
  }

  /**
   * Format the sheet (apply colors, freeze header, etc.)
   * TODO: Implement formatting to match your budget layout
   */
  async formatSheet(spreadsheetId: string): Promise<void> {
    const token = this.authService.getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    // TODO: Add batch update request to format the sheet
    // This could include:
    // - Freeze header row
    // - Apply colors to section headers
    // - Set column widths
    // - Add number formatting

    console.log('[GoogleSheets] Formatting sheet (not yet implemented)');
  }

  /**
   * Create sheets for each year with budget tables
   */
  async addYearSheets(
    spreadsheetId: string,
    transactions: TransactionDetail[],
    incomeData: BudgetRow[],
    expenseData: BudgetRow[],
    disposableData: BudgetRow[]
  ): Promise<void> {
    const token = this.authService.getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    // Extract unique years from transactions
    const yearsSet = new Set<number>();
    transactions.forEach((t) => {
      const dateArray = t.date.split('.');
      const year = parseInt(dateArray[2] || '0');
      if (year > 0) yearsSet.add(year);
    });

    const years = Array.from(yearsSet).sort((a, b) => a - b);
    console.log('[GoogleSheets] Creating sheets for years:', years);

    // Create a sheet for each year
    for (const year of years) {
      await this.createYearSheet(spreadsheetId, year, token);

      // Recalculate budget data ONLY for this year from raw transactions
      const { income: yearIncome, expense: yearExpense } = this.aggregateTransactionsForYear(transactions, year);

      // Calculate disposable income for this year
      const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const yearDisposable: BudgetRow = { category: 'Disposable Income' };
      MONTH_NAMES.forEach((month) => {
        const totalIncome = yearIncome.reduce((sum, row) => sum + Number(row[month] || 0), 0);
        const totalExpenses = yearExpense.reduce((sum, row) => sum + Number(row[month] || 0), 0);
        yearDisposable[month] = totalIncome + totalExpenses;
      });
      this.addTotalsToYearData([yearDisposable]);

      // Write budget data to the year sheet (year-filtered data)
      await this.writeYearBudgetTable(
        spreadsheetId,
        `${year}`,
        yearIncome,
        yearExpense,
        [yearDisposable],
        token
      );
    }
  }

  /**
   * Create a sheet for a specific year
   */
  private async createYearSheet(spreadsheetId: string, year: number, token: string): Promise<void> {
    try {
      // Check if sheet already exists
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      const sheetExists = data.sheets?.some((s: any) => s.properties.title === `${year}`);
      if (sheetExists) {
        console.log(`[GoogleSheets] Sheet for year ${year} already exists`);
        return;
      }

      // Create new sheet
      const batchUpdateResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                addSheet: {
                  properties: {
                    title: `${year}`,
                  },
                },
              },
            ],
          }),
        }
      );

      if (!batchUpdateResponse.ok) {
        throw new Error(`Failed to create sheet for year ${year}`);
      }

      console.log(`[GoogleSheets] ✓ Created sheet for year ${year}`);
    } catch (error) {
      console.error(`[GoogleSheets] Error creating sheet for year ${year}:`, error);
      throw error;
    }
  }

  /**
   * Write budget tables to a year sheet
   */
  private async writeYearBudgetTable(
    spreadsheetId: string,
    sheetName: string,
    incomeData: BudgetRow[],
    expenseData: BudgetRow[],
    disposableData: BudgetRow[],
    token: string
  ): Promise<void> {
    try {
      const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      
      // Build all values for the sheet and track table ranges
      const allValues: (string | number)[][] = [];
      const tableRanges: { name: string; startRow: number; endRow: number }[] = [];
      
      // Income section
      let currentRow = 0;
      allValues.push(['INCOME']);
      currentRow++;
      allValues.push(['Category', ...MONTHS, 'Total', 'Average']);
      const incomeHeaderRow = currentRow;
      currentRow++;
      incomeData.forEach((row) => {
        const values: (string | number)[] = [row.category];
        MONTHS.forEach((month) => {
          values.push(row[month] as number || 0);
        });
        values.push((row['Total'] as number) || 0);
        values.push((row['Average'] as number) || 0);
        allValues.push(values);
        currentRow++;
      });
      const incomeEndRow = currentRow - 1;
      tableRanges.push({ 
        name: 'Income', 
        startRow: incomeHeaderRow, 
        endRow: incomeEndRow 
      });
      
      // Expense section
      allValues.push([]);
      currentRow++;
      allValues.push(['EXPENSES']);
      currentRow++;
      allValues.push(['Category', ...MONTHS, 'Total', 'Average']);
      const expenseHeaderRow = currentRow;
      currentRow++;
      expenseData.forEach((row) => {
        const values: (string | number)[] = [row.category];
        MONTHS.forEach((month) => {
          values.push(row[month] as number || 0);
        });
        values.push((row['Total'] as number) || 0);
        values.push((row['Average'] as number) || 0);
        allValues.push(values);
        currentRow++;
      });
      const expenseEndRow = currentRow - 1;
      tableRanges.push({ 
        name: 'Expenses', 
        startRow: expenseHeaderRow, 
        endRow: expenseEndRow 
      });
      
      // Disposable income section
      allValues.push([]);
      currentRow++;
      allValues.push(['DISPOSABLE INCOME']);
      currentRow++;
      allValues.push(['Category', ...MONTHS, 'Total', 'Average']);
      const disposableHeaderRow = currentRow;
      currentRow++;
      disposableData.forEach((row) => {
        const values: (string | number)[] = [row.category];
        MONTHS.forEach((month) => {
          values.push(row[month] as number || 0);
        });
        values.push((row['Total'] as number) || 0);
        values.push((row['Average'] as number) || 0);
        allValues.push(values);
        currentRow++;
      });
      const disposableEndRow = currentRow - 1;
      tableRanges.push({ 
        name: 'DisposableIncome', 
        startRow: disposableHeaderRow, 
        endRow: disposableEndRow 
      });

      // Write values to sheet
      const range = `${encodeURIComponent(sheetName)}!A1`;
      const writeResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values: allValues }),
        }
      );

      if (!writeResponse.ok) {
        throw new Error(`Failed to write budget data to sheet ${sheetName}`);
      }

      console.log(`[GoogleSheets] ✓ Wrote budget tables to sheet ${sheetName}`);

      // Apply table formatting
      await this.formatYearBudgetTables(
        spreadsheetId,
        sheetName,
        tableRanges,
        token
      );
    } catch (error) {
      console.error(`[GoogleSheets] Error writing budget table to sheet ${sheetName}:`, error);
      throw error;
    }
  }

  /**
   * Apply formatting to budget tables (colors, column widths, filters)
   */
  private async formatYearBudgetTables(
    spreadsheetId: string,
    sheetName: string,
    tableRanges: { name: string; startRow: number; endRow: number }[],
    token: string
  ): Promise<void> {
    try {
      // Get the sheet metadata to find the sheet ID
      const metadataResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const metadata = await metadataResponse.json();
      const sheetId = metadata.sheets?.find((s: any) => s.properties.title === sheetName)?.properties.sheetId;

      if (sheetId === undefined) {
        console.warn(`[GoogleSheets] Could not find sheet ID for ${sheetName}`);
        return;
      }

      const requests: any[] = [];
      const headerColor = { red: 0.2, green: 0.4, blue: 0.8 }; // Blue
      const greenColor = { red: 0, green: 0.5, blue: 0 }; // Green for positive
      const redColor = { red: 1, green: 0, blue: 0 }; // Red for negative

      // Extend column widths - first column (Category) wider, others narrower
      for (let col = 0; col < 15; col++) {
        const pixelWidth = col === 0 ? 200 : 120; // First column 200px, others 120px
        requests.push({
          updateDimensionProperties: {
            range: {
              sheetId,
              dimension: 'COLUMNS',
              startIndex: col,
              endIndex: col + 1,
            },
            properties: {
              pixelSize: pixelWidth,
            },
            fields: 'pixelSize',
          },
        });
      }

      for (const table of tableRanges) {
        const headerRowIndex = table.startRow - 1; // Convert to 0-indexed
        const sectionTitleRowIndex = headerRowIndex - 1; // Row before header (section title like "INCOME")
        const endRowIndex = table.endRow - 1;
        const numColumns = 15; // A to O

        // 0. Format section title row (INCOME, EXPENSES, DISPOSABLE INCOME) - bold, no background
        if (sectionTitleRowIndex >= 0) {
          requests.push({
            repeatCell: {
              range: {
                sheetId,
                startRowIndex: sectionTitleRowIndex,
                endRowIndex: sectionTitleRowIndex + 1,
                startColumnIndex: 0,
                endColumnIndex: numColumns,
              },
              cell: {
                userEnteredFormat: {
                  textFormat: {
                    bold: true,
                    foregroundColor: { red: 0, green: 0, blue: 0 }, // Black text
                  },
                  horizontalAlignment: 'LEFT',
                  verticalAlignment: 'MIDDLE',
                  backgroundColor: { red: 1, green: 1, blue: 1 }, // White background, no blue
                },
              },
              fields: 'userEnteredFormat(textFormat,horizontalAlignment,verticalAlignment,backgroundColor)',
            },
          });
        }

        // 1. Format header row - bold text, no blue background, left-aligned
        requests.push({
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: headerRowIndex,
              endRowIndex: headerRowIndex + 1,
              startColumnIndex: 0,
              endColumnIndex: numColumns,
            },
            cell: {
              userEnteredFormat: {
                textFormat: {
                  bold: true,
                  foregroundColor: { red: 0, green: 0, blue: 0 }, // Black text
                },
                horizontalAlignment: 'LEFT',
                verticalAlignment: 'MIDDLE',
              },
            },
            fields: 'userEnteredFormat(textFormat,horizontalAlignment,verticalAlignment)',
          },
        });

        // 2. Add light borders (thin, light gray) around entire table
        requests.push({
          updateBorders: {
            range: {
              sheetId,
              startRowIndex: headerRowIndex,
              endRowIndex: endRowIndex + 1,
              startColumnIndex: 0,
              endColumnIndex: numColumns,
            },
            top: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
            bottom: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
            left: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
            right: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
            innerHorizontal: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
            innerVertical: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
          },
        });

        // 3. Format data rows with conditional formatting: green for positive, red for negative
        for (let i = headerRowIndex + 1; i <= endRowIndex; i++) {
          // Format the Category column (first column) - no background color
          requests.push({
            repeatCell: {
              range: {
                sheetId,
                startRowIndex: i,
                endRowIndex: i + 1,
                startColumnIndex: 0,
                endColumnIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  horizontalAlignment: 'LEFT',
                },
              },
              fields: 'userEnteredFormat(horizontalAlignment)',
            },
          });

          // Format numeric columns (columns 1-14: month data, total, average)
          // Use conditional formatting: positive = green, negative = red
          requests.push({
            addConditionalFormatRule: {
              rule: {
                ranges: [
                  {
                    sheetId,
                    startRowIndex: i,
                    endRowIndex: i + 1,
                    startColumnIndex: 1,
                    endColumnIndex: numColumns,
                  },
                ],
                booleanRule: {
                  condition: {
                    type: 'NUMBER_GREATER',
                    values: [{ userEnteredValue: '0' }],
                  },
                  format: {
                    textFormat: {
                      foregroundColor: greenColor,
                    },
                  },
                },
              },
              index: 0,
            },
          });

          requests.push({
            addConditionalFormatRule: {
              rule: {
                ranges: [
                  {
                    sheetId,
                    startRowIndex: i,
                    endRowIndex: i + 1,
                    startColumnIndex: 1,
                    endColumnIndex: numColumns,
                  },
                ],
                booleanRule: {
                  condition: {
                    type: 'NUMBER_LESS',
                    values: [{ userEnteredValue: '0' }],
                  },
                  format: {
                    textFormat: {
                      foregroundColor: redColor,
                    },
                  },
                },
              },
              index: 0,
            },
          });
        }

        // 4. Add filter to the header row
        requests.push({
          setBasicFilter: {
            filter: {
              range: {
                sheetId,
                startRowIndex: headerRowIndex,
                endRowIndex: endRowIndex + 1,
                startColumnIndex: 0,
                endColumnIndex: numColumns,
              },
            },
          },
        });
      }

      // Apply all formatting in a batch update
      if (requests.length > 0) {
        const formatResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ requests }),
          }
        );

        if (!formatResponse.ok) {
          const errorData = await formatResponse.json();
          console.warn(`[GoogleSheets] Error applying formatting:`, errorData);
          return;
        }

        console.log(`[GoogleSheets] ✓ Applied table formatting to ${sheetName}`);
      }
    } catch (error) {
      console.error(`[GoogleSheets] Error in formatYearBudgetTables:`, error);
      // Don't throw - formatting shouldn't fail the sync
    }
  }

  /**
   * Recalculate budget data for a specific year from raw transactions
   */
  private filterBudgetByYear(budgetData: BudgetRow[], year: number): BudgetRow[] {
    // Since budget data is pre-aggregated across all years,
    // we need to recalculate from transactions to isolate this year's data
    // This will be called from addYearSheets which has access to transactions
    // For now, return data as-is (will be overridden by aggregateTransactionsForYear)
    return budgetData;
  }

  /**
   * Recalculate budget data for specific year from transactions
   */
  private aggregateTransactionsForYear(
    transactions: TransactionDetail[],
    year: number
  ): { income: BudgetRow[]; expense: BudgetRow[] } {
    const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const income: BudgetRow[] = [];
    const expenses: BudgetRow[] = [];

    // Filter transactions for this year and aggregate
    for (const transaction of transactions) {
      const dateArray = transaction.date.split('.');
      const txYear = parseInt(dateArray[2] || '0');
      if (txYear !== year) continue;

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
    this.addTotalsToYearData(income);
    this.addTotalsToYearData(expenses);

    return { income, expense: expenses };
  }

  private addTotalsToYearData(entries: BudgetRow[]): void {
    const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    entries.forEach((entry) => {
      const total = MONTH_NAMES.reduce((sum, m) => sum + Number(entry[m] || 0), 0);
      entry['Total'] = parseFloat(total.toFixed(2));
      entry['Average'] = parseFloat((total / 12).toFixed(2));
    });
  }
}
