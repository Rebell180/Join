import {
  Component,
  signal,
  computed,
  input,
  output,
  HostListener,
  ElementRef,
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

  // #region attributes

  selectedTimestamp = input.required<Timestamp>();
  dateSelected = output<Timestamp>();
  
  protected showCalendar = signal(false);
  protected activeMonth = signal<number>(Timestamp.now().toDate().getMonth());
  protected activeYear = signal<number>(Timestamp.now().toDate().getFullYear());
  protected months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  protected years = Array.from({ length: 50 }, (_, i) => 2000 + i);
  protected warningMessage = signal<string | null>(null);
  protected inputValue = computed(() => {
    const d = this.selectedTimestamp().toDate();
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
  });
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

  // #endregion attributes

  constructor(private elementRef: ElementRef) {}

  // #region methods

  /**
   * toggles the visibility of calendar pop up.
   * 
   * @param event 
   */
  toggleCalendar(event: Event) {
    event.stopPropagation();
    this.showCalendar.update((v) => !v);
  }

  /**
   * Set the selected date to current.
   * 
   * @param day object with timestamp and boolean of is currentMonth.
   * @returns only if it is a date in past. sets warningMessage.
   */
  selectDate(day: { date: Timestamp; isCurrentMonth: boolean }) {
    if (this.isPastDate(day.date)) {
      this.warningMessage.set('cannot set date in past.');
      this.showCalendar.set(false);
      return;
    }

    this.warningMessage.set(null);
    this.dateSelected.emit(day.date);
    this.showCalendar.set(false);
  }

  /**
   * Sets the calendar to the next month.
   * Switch year if it reaches last month.
   * 
   * button 'next' function
   */
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

  /**
   * Sets the calendar to the previous month.
   * Switch year if it reaches first month.
   * 
   * button 'prev' function
   */
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

  /**
   * Set the new index of month array.
   * 
   * @param monthIndex index of month array.
   */
  onMonthChange(monthIndex: number) {
    this.activeMonth.set(+monthIndex);
  }

  /**
   * Set the index of month array.
   * 
   * @param year index of year array.
   */
  onYearChange(year: number) {
    this.activeYear.set(+year);
  }

  /**
   * Check if the day is selected.
   * 
   * @param day the day to check.
   * @returns a boolean , true if day is selected.
   */
  isSelected(day: Timestamp): boolean {
    const sel = this.selectedTimestamp().toDate();
    const d = day.toDate();
    return (
      d.getDate() === sel.getDate() &&
      d.getMonth() === sel.getMonth() &&
      d.getFullYear() === sel.getFullYear()
    );
  }

  /**
   * Check if it is a date in past.
   * 
   * @param ts the timestamp to check
   * @returns a boolean , true if is past date.
   */
  protected isPastDate(ts: Timestamp): boolean {
    const now = new Date();
    const date = ts.toDate();
    now.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < now;
  }

  /**
   * Click event of onClick outside of content to close pop up.
   * 
   * @param event click event on outside of content.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showCalendar.set(false);
    }
  }

  // #endregion methods
}

// #region next try
  // currentMonth : number = Timestamp.now().toDate().getMonth();
  // currentMonthTxt = () => this.currentMonth < 10 
  //   ? '0' + this.currentMonth.toString() 
  //   : this.currentMonth.toString();
  // isCurrentMonthEdit = () => false;
  // currentDay: number = Timestamp.now().toDate().getDay();
  // currentDayTxt = () => this.currentDay < 10 
  //   ? '0' + this.currentDay.toString() 
  //   : this.currentDay.toString();
  // isCurrentDayEdit = () => false;
  // currentYear: number = Timestamp.now().toDate().getFullYear();
  // isCurrentYearEdit = () => false;

  // isOpen: boolean = false;

  // // #endregion attributes

  // constructor(private elementRef: ElementRef) {
  //   console.log(this.currentDay);
  //   console.log(this.currentMonth);
  //   console.log(this.currentYear);
  // }

  // // #region methods


  // /**
  //  * Toggles the date picker selection modal.
  //  */
  // togglePicker() {
  //   this.isOpen = !this.isOpen;
  //   this.setDate();
  // }

  // toggleEditState(kind: 'month' | 'day' | 'year' | null) {
  //   switch(kind){
  //     case 'month':
  //       if(this.isCurrentMonthEdit()) {
  //         this.isCurrentMonthEdit = () => false;
  //       }
  //       else {
  //         this.isCurrentMonthEdit = () => true;
  //         this.isCurrentDayEdit = () => false;
  //         this.isCurrentYearEdit = () => false;
  //       }
  //       break;
  //     case 'day':
  //       if(this.isCurrentDayEdit()) {
  //         this.isCurrentDayEdit = () => false;
  //       }
  //       else {
  //         this.isCurrentDayEdit = () => true;
  //         this.isCurrentMonthEdit = () => false;
  //         this.isCurrentYearEdit = () => false;
  //       }
  //       break;
  //     case 'year':
  //       if(this.isCurrentYearEdit()) {
  //         this.isCurrentYearEdit = () => false;
  //       }
  //       else {
  //         this.isCurrentYearEdit = () => true;
  //         this.isCurrentDayEdit = () => false;
  //         this.isCurrentMonthEdit = () => false;
  //       } 
  //       break;
  //     default: 
  //       this.isCurrentYearEdit = () => false;
  //       this.isCurrentDayEdit = () => false;
  //       this.isCurrentMonthEdit = () => false;
  //       break;
  //   }
  // }

  // getCurrentDate = () => {
  //   return this.currentMonthTxt() + " / " + this.currentDayTxt() + " / " + this.currentYear;
  // }

  // setDate() {
  //   const date = this.selectedTimestamp().toDate();
  //   this.currentMonth = date.getMonth();
  //   this.currentDay = date.getDay();
  //   this.currentYear = date.getFullYear();
  // }

  // addTime(kind: 'day' | 'month' | 'year') {
  //   switch(kind) {
  //     case 'day':
  //       if(this.currentDay < this.getLastDateOfMonth()) {
  //         this.currentDay++;
  //       }
  //       else {
  //         this.currentDay = 1;
  //         this.addTime('month');
  //       }
  //       break;
  //     case 'month':
  //       if(this.currentMonth < 12) {
  //         this.currentMonth++;
  //       } else {
  //         this.currentMonth = 1;
  //         this.addTime('year');
  //       }
  //       break;
  //     case 'year':
  //       this.currentYear++;
  //       break;
  //     default: 
  //       break;
  //   }
  //   this.updateDueDate();
  // }

  // subTime(kind: 'day' | 'month' | 'year') {
  //   switch(kind) {
  //     case 'day':
  //       if(this.currentDay > 1) {
  //         this.currentDay--;
  //       } else {
  //         this.subTime('month');
  //       }
  //       break;
  //     case 'month':
  //       if(this.currentMonth > 1) {
  //         this.currentMonth--;
  //       } else {
  //         this.currentMonth = 12;
  //         this.subTime('year');
  //       }
  //       this.currentDay = this.getLastDateOfMonth();
  //       break;
  //     case 'year':
  //       this.currentYear--;
  //       break;
  //     default: 
  //       break;
  //   }
  //   this.updateDueDate();
  // }

  // getLastDateOfMonth() {
  //   switch(this.currentMonth) {
  //     case 1:
  //     case 3:
  //     case 5:
  //     case 7:
  //     case 8:
  //     case 10:
  //     case 12:
  //       return 31;
  //     case 4:
  //     case 6: 
  //     case 9:
  //     case 11:
  //       return 30;
  //     case 2:
  //       if(this.currentYear / 4 == 0) {
  //         return 29;
  //       } else {
  //         return 28;
  //       }
  //     default:
  //       return 31;
  //   }
  // }

  // validateInput(kind: 'month' | 'day' | 'year' ){
  //   switch(kind){
  //     case 'month':

  //       break;
  //     case 'day': 
  //       break;
  //     case 'year':
  //       break;
  //   }
  // }

  // updateDueDate() {
  //   const dateNow = Timestamp.now().toDate();
  //   dateNow.setDate(new Date(this.currentYear, this.currentMonth, this.currentDay).getMilliseconds());
  //   const newTimestamp = new Timestamp(dateNow.getSeconds(), dateNow.getMilliseconds());
  //   this.dateSelected.emit(newTimestamp);
  // }

// #endregion try