import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContactGroupComponent } from './contact-group/contact-group.component';
import { DummyContactService } from './dummy-contact.service';
import { Contact } from '../../../shared/classes/contact';


@Component({
  selector: 'app-contact-list',
  imports: [
    CommonModule,
    ContactGroupComponent
],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent {
  protected groups: string[] = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  private contacts: Contact[];

  constructor(private dcs:DummyContactService) {
    this.contacts = dcs.contacts;
    this.setGroups();
  }

  setGroups() {
    this.groups = [];
    this.contacts.forEach(element => {
      const tempLetter = element.firstName[0];
      if(!this.groups.includes(tempLetter)){
        this.groups.push(tempLetter);
      }
    });
  }
}
