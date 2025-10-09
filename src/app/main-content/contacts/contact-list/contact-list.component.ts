import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Contact } from '../../../shared/classes/contact';
import { FireContactService } from '../../../shared/services/fire-contact.service';
import { FormsModule } from "@angular/forms";
import { ContactService } from '../../../shared/services/contact.service';
import { ContactIconComponent } from "../contact-icon/contact-icon.component";

@Component({
  selector: 'app-contact-list',
  imports: [
    CommonModule,
    FormsModule,
    ContactIconComponent
],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent {
  // fireContactService: FireContactService = inject(FireContactService);
  cs: ContactService = inject(ContactService);
  
  // single Contact

  /**
   * Gets the full name of contact.
   * @returns - Full name of contact.
   */
  fullName(contact: Contact):string {
    return `${contact.firstname} ${contact.lastname}`;
  }

  /**
   * 
   * 
   * @param word the string to limit.
   * @param maxLength number indicates the max of displaying chars.
   * @returns string combined name (firstname + lastname)
   */
  limit(word: string, maxLength: number): string {
    return word.length <= maxLength ? word : word.slice(0, maxLength) + '...';
  }

  protected selectContact(contact:Contact|null) {
    this.cs.selectContact(contact)
  }
}