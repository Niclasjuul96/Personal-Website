import { Component, EventEmitter, Output } from '@angular/core';
import { CsvParserService } from '../../services/csv-parser.service';
import { ParsedCsvData, TransactionDetail } from '../../models/types';
import { defaultCsvStructure, CsvStructure } from '../../constants/csv-structure';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'csv-upload',
  templateUrl: './csv-upload.html',
  styleUrls: ['./csv-upload.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CsvUpload {
  @Output() dataParsed = new EventEmitter<ParsedCsvData>();
  @Output() transactionsToSync = new EventEmitter<TransactionDetail[]>(); // New output for syncing

  selectedFile: File | null = null;
  csvPreview: string[][] = [];
  showModal = false;
  showEditStructure = false;
  isDragging = false;

  customStructure: CsvStructure = { ...defaultCsvStructure };
  columnFields = ['date', 'title', 'amount', 'mainCategory', 'subCategory'];

  constructor(private csvParser: CsvParserService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.prepareFile(input.files[0]);
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    const file = event.dataTransfer?.files?.[0];
    if (!file) return;

    this.prepareFile(file);
  }

  private prepareFile(file: File): void {
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const rows = text
        .split('\n')
        .map((r) => r.split(';'))
        .filter((r) => r.length > 1);
      this.csvPreview = rows.slice(0, 5);
      this.showModal = true;
    };
    reader.readAsText(this.selectedFile);
  }

  toggleEditStructure(): void {
    this.showEditStructure = !this.showEditStructure;
  }

  handleStructureChange(field: keyof CsvStructure, value: number): void {
    this.customStructure = {
      ...this.customStructure,
      [field]: Number(value)
    };
  }

  confirmImport(): void {
    if (!this.selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const parsed = this.csvParser.parseCsvContent(text, this.customStructure);
      
      // Emit the parsed data
      this.dataParsed.emit(parsed);
      
      // Also emit transactions for syncing to Google Sheets
      this.transactionsToSync.emit(parsed.transactions);
      
      this.showModal = false;
    };
    reader.readAsText(this.selectedFile);
  }

  cancelImport(): void {
    this.showModal = false;
  }

  getStructureValue(field: string): number | undefined {
    return this.customStructure[field as keyof CsvStructure];
  }

  onStructureChange(field: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = Number(target.value);
    this.handleStructureChange(field as keyof CsvStructure, value);
  }
}
