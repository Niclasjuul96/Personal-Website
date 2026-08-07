import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDetail } from '../../models/types';

@Component({
  selector: 'transaction-details',
  standalone: true,
  templateUrl: './transaction-details.html',
  styleUrls: ['./transaction-details.scss'],
  imports: [CommonModule]
})
export class TransactionDetails implements OnDestroy {
  @Input() selectedDetails: {
    category: string;
    month: string;
    source: 'income' | 'expense' | 'disposable';
  } | null = null;


  @Input() transactions: TransactionDetail[] = [];
  @Output() close = new EventEmitter<void>();

  @ViewChild('wrapper') wrapperRef!: ElementRef<HTMLElement>;

  ngOnDestroy(): void {
    // Remove listeners when component is destroyed
    document.removeEventListener('mousedown', this.handleMouseDown, true);
    document.removeEventListener('mouseup', this.handleClickOutside);
  }

  ngAfterViewInit(): void {
    document.addEventListener('mousedown', this.handleMouseDown, true);
    document.addEventListener('mouseup', this.handleClickOutside);
  }

  private clickedInsideTable = false;

  handleMouseDown = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    this.clickedInsideTable = !!target.closest('td.cursor-pointer');
  };

  handleClickOutside = (event: MouseEvent) => {
    if (this.clickedInsideTable) {
      this.clickedInsideTable = false;
      return;
    }

  if (this.wrapperRef && !this.wrapperRef.nativeElement.contains(event.target as Node)) {
    this.close.emit();
  }

  };

  get filteredTransactions(): TransactionDetail[] {
     if (!this.selectedDetails) return [];
    const { category, month, source } = this.selectedDetails;

    return this.transactions.filter((t) => {
      if (source === 'income' && t.amount < 0) return false;
      if (source === 'expense' && t.amount >= 0) return false;

      if (category === 'Total Income') {
        if (month === 'Total') return t.amount >= 0;
        return t.amount >= 0 && t.month === month;
      } else if (category === 'Total Expenses') {
        if (month === 'Total') return t.amount < 0;
        return t.amount < 0 && t.month === month;
      } else if (month === 'Total') {
        return t.mainCategory === category;
      } else {
        return t.mainCategory === category && t.month === month;
      }
    });
  }
}
