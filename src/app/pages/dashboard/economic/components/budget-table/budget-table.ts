import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BudgetRow } from '../../models/types';
import { MONTH_COLUMNS } from '../../constants/months';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'budget-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget-table.html',
  styleUrls: ['./budget-table.scss']
})
export class BudgetTable {
  @Input() incomeData: BudgetRow[] = [];
  @Input() expenseData: BudgetRow[] = [];
  @Input() disposableIncomeData: BudgetRow[] = [];

  @Output() cellClick = new EventEmitter<{
    category: string;
    month: string;
    source: 'income' | 'expense' | 'disposable';
  }>();

  monthColumns = MONTH_COLUMNS;

  emitCellClick(category: string, month: string, source: 'income' | 'expense' | 'disposable') {
    this.cellClick.emit({ category, month, source });
  }

  isClickable(row: BudgetRow, month: string): boolean {
    const value = row[month];
    const isNumber = typeof value === 'number';
    const isAverageColumn = month === 'Average';
    const isDisposableRow = row.category === 'Disposable Income';
    return isNumber && !isAverageColumn && !isDisposableRow;
  }
}
