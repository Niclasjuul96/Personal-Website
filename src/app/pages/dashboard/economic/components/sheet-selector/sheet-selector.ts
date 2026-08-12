import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GoogleSheetsService } from '../../services/google-sheets.service';
import { GoogleAuthService } from '../../../../../services/google-auth.service';
import { GOOGLE_CONFIG } from '../../../../../constants/google-config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

@Component({
  selector: 'sheet-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sheet-selector.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './sheet-selector.scss'
})
export class SheetSelector implements OnInit {
  sheetsService = inject(GoogleSheetsService);
  authService = inject(GoogleAuthService);

  isAuthenticated$ = this.authService.isAuthenticated;
  sheetId: string | null = null;
  sheetIdInput: string = '';
  isCreating = false;
  isLinking = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadSheetId();
  }

  loadSheetId(): void {
    this.sheetId = this.sheetsService.getSheetId();
  }

  async createNewSheet(): Promise<void> {
    this.isCreating = true;
    this.error = null;

    try {
      const id = await this.sheetsService.initializeSheet();
      this.sheetId = id;
      this.sheetIdInput = '';
      console.log('[SheetSelector] Sheet created successfully:', id);
    } catch (err: any) {
      this.error = `Failed to create sheet: ${err.message}`;
      console.error('[SheetSelector] Error creating sheet:', err);
    } finally {
      this.isCreating = false;
    }
  }

  async linkExistingSheet(): Promise<void> {
    if (!this.sheetIdInput.trim()) {
      this.error = 'Please enter a valid Google Sheet ID';
      return;
    }

    this.isLinking = true;
    this.error = null;

    try {
      await this.sheetsService.getSheetMetadata(this.sheetIdInput);
      await this.sheetsService.ensureHeaders(this.sheetIdInput);

      this.sheetsService.setSheetId(this.sheetIdInput);
      this.sheetId = this.sheetIdInput;
      this.sheetIdInput = '';
      console.log('[SheetSelector] Sheet linked successfully:', this.sheetId);
    } catch (err: any) {
      this.error = `Failed to link sheet: ${err.message}. Make sure the ID is correct and the sheet is accessible.`;
      console.error('[SheetSelector] Error linking sheet:', err);
    } finally {
      this.isLinking = false;
    }
  }

  unlinkSheet(): void {
    this.sheetId = null;
    this.sheetIdInput = '';
    this.sheetsService.clearSheetId();
    this.error = null;
  }

  browseGoogleDrive(): void {
    if (!GOOGLE_CONFIG.API_KEY) {
      this.error = 'Drive browsing needs a Google API key configured first (GOOGLE_CONFIG.API_KEY is empty). Use "Link existing sheet" below instead for now.';
      return;
    }

    if (!window.gapi) {
      this.error = 'Google API not loaded yet. Please try again.';
      return;
    }

    window.gapi.load('picker', () => {
      this.openGooglePicker();
    });
  }

  private openGooglePicker(): void {
    const token = this.authService.getAccessToken();
    if (!token) {
      this.error = 'Not authenticated. Please log in first.';
      return;
    }

    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.SPREADSHEETS)
      .setOAuthToken(token)
      .setDeveloperKey(this.getDeveloperKey())
      .setCallback((data: any) => this.handlePickerCallback(data))
      .build();

    picker.setVisible(true);
  }

  private handlePickerCallback(data: any): void {
    if (data.action === window.google.picker.Action.PICKED) {
      const file = data.docs[0];
      const sheetId = file.id;

      this.sheetIdInput = sheetId;
      this.linkExistingSheet();
    } else if (data.action === window.google.picker.Action.CANCEL) {
      console.log('[SheetSelector] Picker cancelled');
    }
  }

  private getDeveloperKey(): string {
    return GOOGLE_CONFIG.API_KEY;
  }

  clearError(): void {
    this.error = null;
  }

  getSheetUrl(): string {
    if (!this.sheetId) return '#';
    return `https://docs.google.com/spreadsheets/d/${this.sheetId}`;
  }

  getSheetPreview(): string {
    if (!this.sheetId) return '';
    if (this.sheetId.length <= 18) return this.sheetId;
    return `${this.sheetId.slice(0, 8)}...${this.sheetId.slice(-6)}`;
  }
}
