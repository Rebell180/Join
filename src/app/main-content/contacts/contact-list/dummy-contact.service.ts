import { Injectable } from '@angular/core';
import { Contact } from '../../../shared/classes/contact';

@Injectable({
  providedIn: 'root'
})
export class DummyContactService {
  
  contacts: Contact[];

  constructor() {
    this.contacts = DummyContactService.getAllContacts();
  }

  static getAllContacts(): Contact[] {
    return [
      new Contact({id:'', firstName:'Anton', lastName:'Mayer', group:'A', email:'antonm@gmail.com',tel: '0171 123456789', iconColor:null}),
      new Contact({id:'', firstName:'Anja', lastName:'Schulz', group:'A', email:'schulz@hotmail.com',tel: '0171 123456789', iconColor:null}),
      new Contact({id:'', firstName:'John', lastName:'Doe', group:'J', email:'johndoe@mail.de',tel: '0171 123456789', iconColor:null})
    ]
  }

  getContactsByGroup(group: string): Contact[] {
    return this.contacts.filter(contact => contact.group == group);
  }
}
