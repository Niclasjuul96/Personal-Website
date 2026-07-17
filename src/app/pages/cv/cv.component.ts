import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import {
  cvProfile,
  roleContentByRole,
  type CvEducationItem,
  type CvRole,
  type DateRange,
  type LocalizedText,
  type SupportedLanguage
} from '../../data/cv-profile';

interface DisplayExperienceItem {
  label: string;
  date: DateRange;
  description: LocalizedText;
  isWorkExperience: boolean;
}

interface ExportPreset {
  lang: SupportedLanguage;
  role: CvRole;
  label: string;
}

@Component({
  selector: 'app-cv',
  imports: [NgFor, NgIf],
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.scss'
})
export class CvComponent implements OnInit, OnDestroy {
  private readonly storageLangKey = 'cv:selectedLanguage';
  private readonly storageRoleKey = 'cv:selectedRole';
  private readonly printModeClass = 'cv-print-mode';

  protected readonly profile = cvProfile;
  protected readonly languageOptions: Array<{ code: SupportedLanguage; label: string }> = [
    { code: 'en', label: 'English' },
    { code: 'da', label: 'Dansk' }
  ];
  protected readonly roleOptions: Array<{ key: CvRole; labelEn: string; labelDa: string }> = [
    { key: 'developer', labelEn: 'Software Engineer', labelDa: 'Softwareudvikler' },
    { key: 'it-support', labelEn: 'IT Support', labelDa: 'IT Support' },
    { key: 'general', labelEn: 'General Profile', labelDa: 'Generel Profil' }
  ];
  protected readonly exportPresets: ExportPreset[] = [
    { lang: 'en', role: 'developer', label: 'EN - Software Engineer' },
    { lang: 'en', role: 'it-support', label: 'EN - IT Support' },
    { lang: 'en', role: 'general', label: 'EN - General Profile' },
    { lang: 'da', role: 'developer', label: 'DA - Softwareudvikler' },
    { lang: 'da', role: 'it-support', label: 'DA - IT Support' },
    { lang: 'da', role: 'general', label: 'DA - Generel Profil' }
  ];
  protected readonly sectionLabels = {
    experience: { en: 'Experience', da: 'Erfaring' },
    workExperience: { en: 'Work Experience', da: 'Erhvervserfaring' },
    otherExperience: { en: 'Other Experience', da: 'Ovrig erfaring' },
    education: { en: 'Education', da: 'Uddannelse' },
    softSkills: { en: 'Soft Skills', da: 'Personlige kompetencer' },
    languageSkills: { en: 'Languages', da: 'Sprog' },
    spareTime: { en: 'Spare Time', da: 'Fritid' },
    summary: { en: 'Professional Summary', da: 'Professionelt Resume' },
    skillProfile: { en: 'Skill Profile', da: 'Kompetenceprofil' },
    combinedExperience: { en: 'Combined Experience', da: 'Samlet Erfaring' },
    latestRole: { en: 'Latest role', da: 'Nyeste rolle' },
    previousRole: { en: 'Previous role', da: 'Tidligere rolle' },
    workBadge: { en: 'Work', da: 'Arbejde' },
    otherBadge: { en: 'Other', da: 'Andet' }
  } as const;

  protected lang: SupportedLanguage = 'en';
  protected role: CvRole = 'developer';
  protected isPrintOptionsOpen = false;
  protected copied = false;

  protected combinedExperience: DisplayExperienceItem[] = [];

  ngOnInit(): void {
    this.loadPreferences();
    this.updateDocumentTitle();
    this.combinedExperience = this.buildCombinedExperience();
    window.addEventListener('afterprint', this.handleAfterPrint);
  }

  ngOnDestroy(): void {
    window.removeEventListener('afterprint', this.handleAfterPrint);
    this.clearPrintMode();
  }

  protected get roleContent() {
    return roleContentByRole[this.role];
  }

  protected get currentFilename(): string {
    return this.generateFilename(this.role, this.lang);
  }

  protected switchLanguage(lang: SupportedLanguage): void {
    this.lang = lang;
    this.persistPreferences();
    this.updateDocumentTitle();
  }

  protected switchRole(role: CvRole): void {
    this.role = role;
    this.persistPreferences();
    this.updateDocumentTitle();
  }

  protected applyPreset(preset: ExportPreset): void {
    this.lang = preset.lang;
    this.role = preset.role;
    this.persistPreferences();
    this.updateDocumentTitle();
  }

  protected togglePrintOptions(): void {
    this.isPrintOptionsOpen = !this.isPrintOptionsOpen;
  }

  protected copyFilename(): void {
    navigator.clipboard.writeText(this.currentFilename);
    this.copied = true;

    setTimeout(() => {
      this.copied = false;
    }, 2000);
  }

  protected printCurrentSelection(): void {
    this.enablePrintMode();
    window.print();
  }

  protected renderDate(date: DateRange): string[] {
    return Array.isArray(date) ? date : [date];
  }

  protected getEducationTitle(item: CvEducationItem): string {
    return item.name[this.lang];
  }

  protected getTranslated(text: LocalizedText): string {
    return text[this.lang];
  }

  protected getRoleLabel(index: number): string {
    if (index === 0) {
      return this.sectionLabels.latestRole[this.lang];
    }
    return this.sectionLabels.previousRole[this.lang];
  }

  protected getRoleLabelText(option: { labelEn: string; labelDa: string }): string {
    return this.lang === 'da' ? option.labelDa : option.labelEn;
  }

  protected getFilenameForPreset(preset: ExportPreset): string {
    return this.generateFilename(preset.role, preset.lang);
  }

  protected getPrintHelpText(): string {
    if (this.lang === 'da') {
      return 'Vaelg en preset for sprog/rolle, kopiér filnavnet, og vaelg derefter Print for at gemme som PDF.';
    }

    return 'Pick a language/role preset, copy the filename, then use Print to save as PDF.';
  }

  protected getExperienceForCurrentRole(): DisplayExperienceItem[] {
    if (this.role === 'general') {
      return this.combinedExperience;
    }

    return this.profile.workExperience.map((item) => ({
      label: item.company,
      date: item.date,
      description: item.description,
      isWorkExperience: true
    }));
  }

  protected getOtherExperienceForCurrentRole(): DisplayExperienceItem[] {
    if (this.role === 'general') {
      return [];
    }

    return this.profile.otherExperience.map((item) => ({
      label: item.name,
      date: item.date,
      description: item.description,
      isWorkExperience: false
    }));
  }

  private buildCombinedExperience(): DisplayExperienceItem[] {
    const work = this.profile.workExperience.map((item) => ({
      label: item.company,
      date: item.date,
      description: item.description,
      isWorkExperience: true
    }));

    const other = this.profile.otherExperience.map((item) => ({
      label: item.name,
      date: item.date,
      description: item.description,
      isWorkExperience: false
    }));

    return [...work, ...other].sort((a, b) => this.getLatestYear(b.date) - this.getLatestYear(a.date));
  }

  private generateFilename(role: CvRole, lang: SupportedLanguage): string {
    let roleText = 'General';
    if (role === 'developer') {
      roleText = 'SoftwareEngineer';
    } else if (role === 'it-support') {
      roleText = 'ITSupport';
    }

    const langText = lang === 'en' ? 'EN' : 'DA';
    return `Niclas_JuulSchaeffer_${roleText}_${langText}.pdf`;
  }

  private updateDocumentTitle(): void {
    const roleTitle = this.roleContent.title;
    document.title = `${roleTitle} CV | Niclas Schæffer Portfolio`;
  }

  private loadPreferences(): void {
    const storedLang = localStorage.getItem(this.storageLangKey);
    const storedRole = localStorage.getItem(this.storageRoleKey);

    if (storedLang === 'en' || storedLang === 'da') {
      this.lang = storedLang;
    }

    if (storedRole === 'developer' || storedRole === 'it-support' || storedRole === 'general') {
      this.role = storedRole;
    }
  }

  private persistPreferences(): void {
    localStorage.setItem(this.storageLangKey, this.lang);
    localStorage.setItem(this.storageRoleKey, this.role);
  }

  private getLatestYear(date: DateRange): number {
    const values = Array.isArray(date) ? date : [date];

    const years: number[] = [];

    values.forEach((value) => {
      const parts = value.split(' - ');
      const endPart = parts[parts.length - 1] || '';
      const matches = endPart.match(/\d{4}/g);

      if (matches && matches.length > 0) {
        years.push(...matches.map((match) => Number.parseInt(match, 10)));
        return;
      }

      if (endPart.toLowerCase() === 'present') {
        const startPart = parts[0] || '';
        const startYearMatch = startPart.match(/\d{4}/);
        if (startYearMatch) {
          years.push(Number.parseInt(startYearMatch[0], 10));
        }
      }
    });

    return years.length > 0 ? Math.max(...years) : 0;
  }

  private readonly handleAfterPrint = (): void => {
    this.clearPrintMode();
  };

  private enablePrintMode(): void {
    document.documentElement.classList.add(this.printModeClass);
    document.body.classList.add(this.printModeClass);
  }

  private clearPrintMode(): void {
    document.documentElement.classList.remove(this.printModeClass);
    document.body.classList.remove(this.printModeClass);
  }
}
