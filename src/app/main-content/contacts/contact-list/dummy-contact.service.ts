import { Injectable } from '@angular/core';
import { Contact } from '../../../shared/classes/contact';

@Injectable({
  providedIn: 'root'
})
export class DummyContactService {
  
  contacts: Contact[];

  constructor() {
    this.contacts = this.getAllContacts();
  }

  getAllContacts():Contact[] {
    return [
      new Contact({id:'', firstName:'John', lastName:'Doe', group:'J', email:'johndoe@mail.de',tel: '0171 123456789', iconColor:null})
    ]
  }
}
