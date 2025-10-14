import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Contact } from '../../../shared/classes/contact';
import { FormsModule } from "@angular/forms";
import { ContactService } from '../../../shared/services/contact.service';
import { ContactIconComponent } from "../contact-icon/contact-icon.component";
import { Observable } from 'rxjs';
import { ContactGroup } from '../../../shared/classes/contactGroup';

@Component({
  selector: 'section[contact-list]',
  imports: [
    CommonModule,
    FormsModule,
    ContactIconComponent
],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent {
  cs: ContactService = inject(ContactService);
  groups$: Observable<ContactGroup[]> = this.cs.getAllGroups();
  /**
   * Gets the full name of contact.
   * @returns - Full name of contact.
   */
  fullName(contact: Contact):string {
    return `${contact.firstname} ${contact.lastname}`;
  }

  /**
   * @param word the string to limit.
   * @param maxLength number indicates the max of displaying chars.
   * @returns string combined name (firstname + lastname)
   */
  limit(word: string, maxLength: number): string {
    return word.length <= maxLength ? word : word.slice(0, maxLength) + '...';
  }
}