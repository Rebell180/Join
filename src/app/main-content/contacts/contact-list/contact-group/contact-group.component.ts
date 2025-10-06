import { Component, inject, input, InputFunction } from '@angular/core';
import { Contact } from '../../../../shared/classes/contact';
import { DummyContactService } from '../dummy-contact.service';
import { CommonModule } from '@angular/common';
import { SingleContactComponent } from './single-contact/single-contact.component';
import { FireContactService } from '../../../../shared/services/fire-contact.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contact-group',
  imports: [
    CommonModule,
    SingleContactComponent
  ],
  templateUrl: './contact-group.component.html',
  styleUrl: './contact-group.component.scss'
})
export class ContactGroupComponent {
  fireContactService: FireContactService = inject(FireContactService);
  public letter = input.required<string>();
  private allContacts: Contact[] = [];

  getContacts(): Observable<Contact[]> {
    return this.fireContactService.contacts$;
  }

  getContactsByGroup(): Observable<Contact[]> {
    return this.fireContactService.getContactsByGroup$(this.letter());
  }
  
  /**
   * Selects a contact.
   * @param selectedContact - Contact, which has been selected.
   */
  select(selectedContact:Contact):void {
    this.getContacts().forEach((contacts) => {
      for(let i = 0; i < contacts.length; i++) {
        contacts[i].selected = false;
        if (contacts[i].equals(selectedContact)) {
        contacts[i].selected = true;
        this.fireContactService.setCurrentContact(selectedContact.id)
      }
      }
    })
  }
}
