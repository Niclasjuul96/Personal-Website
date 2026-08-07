import { Injectable } from '@angular/core';
import { BudgetEntry, ParsedCsvData, TransactionDetail } from '../models/types';
import { defaultCsvStructure } from '../constants/csv-structure';
import { MONTH_NAMES as months } from '../constants/months';

@Injectable({
  providedIn: 'root',
})
export class CsvParserService {
  parseCsvContent(text: string, structure = defaultCsvStructure): ParsedCsvData {
    const rows = text.split("\n").map((row) => row.split(";"));
    if (rows.length < 2) return { income: [], expenses: [], disposableIncome: [], transactions: [], years: [] };

    const dataRows = rows.slice(1);
    const income: BudgetEntry[] = [];
    const expenses: BudgetEntry[] = [];
    const transactions: TransactionDetail[] = [];
    const years = new Set<number>();

    for (const row of dataRows) {
      if (row.length <= Math.max(
        structure.date,
        structure.amount,
        structure.title,
        structure.mainCategory ?? -1,
        structure.subCategory ?? -1
      )) continue;

      const rawDate = row[structure.date]?.trim() || "";
      const title = row[structure.title]?.trim() || "No title";

      const mainCategory = structure.mainCategory !== undefined
        ? row[structure.mainCategory]?.trim() || "Unknown"
        : "Unknown";

      const subCategory = structure.subCategory !== undefined
        ? row[structure.subCategory]?.trim() || "Unknown"
        : "Unknown";

      // ✅ Always ensure number
      const amount = this.parseAmount(row[structure.amount]);

      const date = new Date(rawDate.split(".").reverse().join("-"));
      if (isNaN(date.getTime())) continue;

      let monthDate = new Date(date);
      const year = monthDate.getFullYear();
      years.add(year);

      // Don't shift income to next month - use actual transaction month
      const month = months[monthDate.getMonth()];

      transactions.push({
        date: rawDate,
        title,
        amount,
        mainCategory,
        subCategory,
        month,
      });

      const targetArray = amount >= 0 ? income : expenses;
      const categoryKey = mainCategory;

      let existing = targetArray.find((i) => i.category === categoryKey);
      if (!existing) {
        const newEntry: BudgetEntry = { category: categoryKey };
        months.forEach((m) => (newEntry[m] = 0));
        targetArray.push(newEntry);
        existing = newEntry;
      }

      existing[month] = Number(existing[month] || 0) + amount;
    }

    this.addTotals(income);
    this.addTotals(expenses);

    const disposable: BudgetEntry = { category: "Disposable Income" };
    months.forEach((month) => {
      const totalIncome = income.reduce((sum, row) => sum + Number(row[month] || 0), 0);
      const totalExpenses = expenses.reduce((sum, row) => sum + Number(row[month] || 0), 0);
      disposable[month] = totalIncome + totalExpenses;
    });
    this.addTotals([disposable]);

    const totalIncome: BudgetEntry = { category: "Total Income" };
    months.forEach((month) => {
      totalIncome[month] = income.reduce((sum, row) => sum + Number(row[month] || 0), 0);
    });
    this.addTotals([totalIncome]);
    income.push(totalIncome);

    const totalExpenses: BudgetEntry = { category: "Total Expenses" };
    months.forEach((month) => {
      totalExpenses[month] = expenses.reduce((sum, row) => sum + Number(row[month] || 0), 0);
    });
    this.addTotals([totalExpenses]);
    expenses.push(totalExpenses);

    return {
      income,
      expenses,
      disposableIncome: [disposable],
      transactions,
      years: Array.from(years).sort(),
    };
  }

  private parseAmount(raw: string): number {
    if (!raw) return 0;
    return parseFloat(raw.replace(/\./g, "").replace(",", ".")) || 0;
  }

  private addTotals(entries: BudgetEntry[]) {
    entries.forEach((entry) => {
      const total = months.reduce((sum, m) => sum + Number(entry[m] || 0), 0);
      entry["Total"] = parseFloat(total.toFixed(2));
      entry["Average"] = parseFloat((total / 12).toFixed(2));
    });
  }
}
