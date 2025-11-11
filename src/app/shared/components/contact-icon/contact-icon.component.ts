import { Component, input, InputSignal } from '@angular/core';
import { Contact } from './../../classes/contact';

@Component({
  selector: 'app-contact-icon',
  imports: [],
  templateUrl: './contact-icon.component.html',
  styleUrl: './contact-icon.component.scss'
})
export class ContactIconComponent {
  public contact: InputSignal<Contact> = input.required<Contact>();

  /**
   * Gets Intials of contact.
   * @returns Intials of contact.
   */
  getInitials(): string {
    const contactObj: Contact = this.contact();
    if(contactObj !== null && contactObj.id != '' ) {
      return contactObj.firstname[0].toUpperCase() + contactObj.lastname[0].toUpperCase();
    }
    return '';
  }
}
