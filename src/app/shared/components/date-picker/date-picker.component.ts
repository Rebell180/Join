import {
  Component,
  signal,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent {
  /** Eingehender Wert vom Parent */
  selectedTimestamp = input.required<Timestamp>();

  /** Gibt das neu gewählte Datum zurück */
  dateSelected = output<Timestamp>();

  /** Zeigt oder versteckt den Kalender */
  protected showCalendar = signal(false);

  /** interner aktueller Monat und Jahr */
  protected activeMonth = signal<number>(Timestamp.now().toDate().getMonth());
  protected activeYear = signal<number>(Timestamp.now().toDate().getFullYear());

  /** Dropdown-Werte */
  protected months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  protected years = Array.from({ length: 50 }, (_, i) => 2000 + i);

  /** Computed Label für Inputfeld */
  protected inputValue = computed(() => {
    const d = this.selectedTimestamp().toDate();
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
  });

  /** Berechnung der Tage für den Grid */
  readonly days = computed(() => {
    const month = this.activeMonth();
    const year = this.activeYear();

    const first = new Date(year, month, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonthDays = new Date(year, month, 0).getDate();

    const grid: { date: Timestamp; isCurrentMonth: boolean }[] = [];

    // vorherige Tage
    for (let i = startDay - 1; i >= 0; i--) {
      const day = new Date(year, month - 1, prevMonthDays - i);
      grid.push({ date: Timestamp.fromDate(day), isCurrentMonth: false });
    }

    // aktuelle Tage
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      grid.push({ date: Timestamp.fromDate(day), isCurrentMonth: true });
    }

    // nächste Tage bis 42 (6 Wochen)
    while (grid.length < 42) {
      const last = grid[grid.length - 1].date.toDate();
      const next = new Date(last);
      next.setDate(last.getDate() + 1);
      grid.push({ date: Timestamp.fromDate(next), isCurrentMonth: false });
    }

    return grid;
  });

  /** Öffnen/Schließen */
  toggleCalendar(event: Event) {
    event.stopPropagation();
    this.showCalendar.update((v) => !v);
  }

  /** Auswahl eines Tages */
  selectDate(day: { date: Timestamp; isCurrentMonth: boolean }) {
    this.dateSelected.emit(day.date);
    this.showCalendar.set(false);
  }

  /** Navigationsmethoden */
  nextMonth() {
    const month = this.activeMonth();
    const year = this.activeYear();
    if (month === 11) {
      this.activeMonth.set(0);
      this.activeYear.set(year + 1);
    } else {
      this.activeMonth.set(month + 1);
    }
  }

  prevMonth() {
    const month = this.activeMonth();
    const year = this.activeYear();
    if (month === 0) {
      this.activeMonth.set(11);
      this.activeYear.set(year - 1);
    } else {
      this.activeMonth.set(month - 1);
    }
  }

  onMonthChange(monthIndex: number) {
    this.activeMonth.set(+monthIndex);
  }

  onYearChange(year: number) {
    this.activeYear.set(+year);
  }

  /** Markierung des selektierten Datums */
  isSelected(day: Timestamp): boolean {
    const sel = this.selectedTimestamp().toDate();
    const d = day.toDate();
    return (
      d.getDate() === sel.getDate() &&
      d.getMonth() === sel.getMonth() &&
      d.getFullYear() === sel.getFullYear()
    );
  }
}
