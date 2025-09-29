import { Component, input } from '@angular/core';
import { Contact } from '../../../shared/classes/contact';

@Component({
  selector: 'app-contact-icon',
  imports: [],
  templateUrl: './contact-icon.component.html',
  styleUrl: './contact-icon.component.scss'
})
export class ContactIconComponent {
  public contact = input.required<Contact>();

  /**
   * Gets Intials of contact.
   * @returns Intials of contact.
   */
  getInitials():string {
    return this.contact().firstName[0].toUpperCase() + this.contact().lastName[0].toUpperCase()
  }
}
