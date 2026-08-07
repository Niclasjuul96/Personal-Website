export interface BudgetEntry {
  category: string;
  [key: string]: string | number | undefined;
}

export interface TransactionDetail {
  date: string;
  title: string;
  amount: number;
  mainCategory: string;
  subCategory: string;
  month: string;
}

export interface ParsedCsvData {
  income: BudgetEntry[];
  expenses: BudgetEntry[];
  disposableIncome: BudgetEntry[];
  transactions: TransactionDetail[];
  years: number[];
}

export interface BudgetRow {
  category: string;
  [key: string]: string | number | undefined;
}
