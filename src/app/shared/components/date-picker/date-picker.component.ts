import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent {

  // #region properties 
  selectedDate = input<Date>(new Date());
  dateChange = output<Date>();

  showCalendar = signal(false);
  inputValue = signal('');
  errorMessage = signal<string | null>(null);

  today = new Date();
  currentMonth = signal(this.today.getMonth());
  currentYear = signal(this.today.getFullYear());

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  years = Array.from({ length: 15 }, (_, i) => this.today.getFullYear() - 5 + i);

  // #endregion properties

  ngOnInit() {
    this.updateInputValue(this.selectedDate());
  }

  /** Klick außerhalb → Popup schließen */
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.date-picker-container')) {
      this.showCalendar.set(false);
    }
  }

  toggleCalendar(event: Event) {
    event.stopPropagation();
    this.showCalendar.update(v => !v);
  }

  /** Tage-Matrix für den Kalender */
  days = computed(() => this.generateCalendarDays(this.currentYear(), this.currentMonth()));

  private generateCalendarDays(year: number, month: number) {
    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = firstDay.getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDayPrevMonth = new Date(year, month, 0).getDate();

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = lastDayPrevMonth - i;
      days.push({ date: new Date(year, month - 1, day), isCurrentMonth: false });
    }
    for (let d = 1; d <= lastDayOfMonth; d++) {
      days.push({ date: new Date(year, month, d), isCurrentMonth: true });
    }
    let nextMonthDay = 1;
    while (days.length < 42) {
      days.push({ date: new Date(year, month + 1, nextMonthDay++), isCurrentMonth: false });
    }
    return days;
  }

  selectDate(day: { date: Date; isCurrentMonth: boolean }) {
    const date = day.date;
    if (!day.isCurrentMonth) {
      this.currentMonth.set(date.getMonth());
      this.currentYear.set(date.getFullYear());
    }
    this.setDate(date);
    this.showCalendar.set(false);
  }

  /** Pfeile / Dropdowns */
  nextMonth() {
    const m = this.currentMonth();
    const y = this.currentYear();
    if (m === 11) {
      this.currentMonth.set(0);
      this.currentYear.set(y + 1);
    } else {
      this.currentMonth.set(m + 1);
    }
  }

  prevMonth() {
    const m = this.currentMonth();
    const y = this.currentYear();
    if (m === 0) {
      this.currentMonth.set(11);
      this.currentYear.set(y - 1);
    } else {
      this.currentMonth.set(m - 1);
    }
  }

  onMonthChange(event: Event) {
    this.currentMonth.set(Number((event.target as HTMLSelectElement).value));
  }

  onYearChange(event: Event) {
    this.currentYear.set(Number((event.target as HTMLSelectElement).value));
  }

  /** Manuelle Eingabe validieren */
  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();
    this.inputValue.set(value);
    this.validateManualInput(value);
  }

  private validateManualInput(value: string) {
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!regex.test(value)) {
      this.errorMessage.set('Invalid date format. Use MM/DD/YYYY.');
      return;
    }

    const [month, day, year] = value.split('/').map(Number);
    const parsed = new Date(year, month - 1, day);

    if (parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
      this.errorMessage.set('Invalid date.');
      return;
    }

    const today = new Date();
    if (parsed < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      this.errorMessage.set('Date cannot be in the past.');
      return;
    }

    this.errorMessage.set(null);
    this.setDate(parsed);
  }

  private setDate(date: Date) {
    this.selectedDate.apply(date);
    this.updateInputValue(date);
    this.dateChange.emit(date);
  }

  private updateInputValue(date: Date) {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    this.inputValue.set(`${mm}/${dd}/${yyyy}`);
  }

  isSelected(date: Date): boolean {
    const selected = this.selectedDate();
    return (
      selected &&
      selected.getFullYear() === date.getFullYear() &&
      selected.getMonth() === date.getMonth() &&
      selected.getDate() === date.getDate()
    );
  }
}

