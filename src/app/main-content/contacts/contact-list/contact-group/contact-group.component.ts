import { Component, input, InputFunction } from '@angular/core';
import { Contact } from '../../../../shared/classes/contact';
import { DummyContactService } from '../dummy-contact.service';
import { CommonModule } from '@angular/common';
import { SingleContactComponent } from './single-contact/single-contact.component';

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
  public letter = input.required<string>();

  constructor(private fcs: FireContactService) {
    this.allContacts = fcs.getContacts();
  }

  /**
   * Gets the members of this Group.
   * @returns - Memberlist
   */
  getMembers(): Contact[] {
    return this.fcs.getMembers(this.letter());
  }

  /**
   * Selects a contact.
   * @param selectedContact - Contact, which has been selected.
   */
  select(selectedContact:Contact):void {
    for(let i = 0; i < this.allContacts.length; i++) {
      this.allContacts[i].selected = false;
      if (this.allContacts[i].equals(selectedContact)) {
        this.allContacts[i].selected = true;
        this.fcs.currentContact = selectedContact;
      }
    }
  }
}
