export interface CsvStructure {
  [key: string]: number | undefined;
  date: number;
  title: number;
  amount: number;
  mainCategory?: number;
  subCategory?: number;
}

export const defaultCsvStructure: CsvStructure = {
  date: 0,         // "Dato"
  title: 1,        // "Tekst"
  amount: 2,       // "Beløb"
  mainCategory: 7, // "Hovedkategori"
  subCategory: 8,  // "Kategori"
};
