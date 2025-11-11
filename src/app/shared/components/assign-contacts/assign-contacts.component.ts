import { Component, HostListener, ElementRef, SimpleChanges, InputSignal, input, output, OutputEmitterRef, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contact } from '../../classes/contact';
import { ContactIconComponent } from "../contact-icon/contact-icon.component";
import { ContactIconListComponent } from "../contact-icon-list/contact-icon-list.component";

@Component({
  selector: 'app-assign-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule, ContactIconComponent, ContactIconListComponent],
  templateUrl: './assign-contacts.component.html',
  styleUrl: './assign-contacts.component.scss'
})
export class AssignContactsComponent implements OnChanges{

  // #region attributes

  options: InputSignal<Array<Contact>> = input.required<Array<Contact>>();
  selectedValues: InputSignal<Array<Contact>> = input.required<Array<Contact>>();
  selectionChange: OutputEmitterRef<Array<Contact>> = output<Array<Contact>>();

  isOpen: boolean = false;
  placeholder: string = 'assign to task';
  searchTerm: string = '';
  selectedValuesLocal: Array<Contact> = [];

  // #endregion attributes

  constructor(private elementRef: ElementRef) {}

  // #region methods

  /** 
   * always returns all contacts wich matches with search term 
   **/
  filteredOptions = () =>
    (this.options() || []).filter((contact) =>
      contact.getFullName().toLowerCase().includes(this.searchTerm.toLowerCase())
    );

  /**
   * Updates selected values on change.
   * 
   * @param changes object with changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedValues']) {
      const incoming: Array<Contact> = changes['selectedValues'].currentValue || [];
      this.selectedValuesLocal = Array.isArray(incoming) ? [...incoming] : [];
    }
  }

  /**
   * Toggles the selection pop up.
   */
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  /**
   * Toogles the selection of contact in options.
   *  
   * @param option to toggle the selection
   */
  toggleSelection(option: Contact) {
    const current = this.selectedValuesLocal;
    const index = current.indexOf(option);
    if (index === -1) {
      this.selectedValuesLocal.push(option);
    } else {
      this.selectedValuesLocal = current.filter((contact) => contact !== option);
    }
    this.selectionChange.emit(this.selectedValuesLocal);
  }
  
  /**
   * Check if the submitted option is selected.
   * 
   * @param option the contact to check if it is selected
   * @returns @boolean true or false
   */
  isSelected(option: Contact) {
    return this.selectedValuesLocal.includes(option);
  }

  /**
   * Click event of onClick outside of content to close pop up.
   * 
   * @param event click event on outside of content.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  // #endregion methods
}
