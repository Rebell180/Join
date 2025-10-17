import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { Contact } from '../../../shared/classes/contact';
import { FormsModule } from "@angular/forms";
import { ContactIconComponent } from "./../../../shared/components/contact-icon/contact-icon.component";
import { FirebaseDBService } from '../../../shared/services/firebase-db.service';
import { Unsubscribe, where, onSnapshot, Query, query } from '@angular/fire/firestore';
import { ModalService } from '../../../shared/services/modal.service';

@Component({
  selector: 'section[contact-list]',
  imports: [
    CommonModule,
    FormsModule,
    ContactIconComponent,
],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent implements OnDestroy {

  // #region properties
  
  private fireDB: FirebaseDBService = inject(FirebaseDBService);
  private modalService: ModalService = inject(ModalService);

  contacts: Array<Contact> = [];
  groups: Array<string> = [];

  unsubContacts: Unsubscribe;

  // #endregion properties 
  constructor() {
    this.unsubContacts = this.getContactsSnapshot();

  }

  ngOnDestroy(): void {
    this.unsubContacts();
  }

  // #region methods

  /**
   * Opens the add contact modal.
   */
  protected openModal() {
    this.modalService.openAddContactModal('add', new Contact());
  }

  /**
   * Select submitted contact and remove selected from all other contacts.
   * 
   * @param contactToSelect contact which has to select
   */
  protected select(contactToSelect: Contact) {
    this.contacts.forEach((contact) => {
      contact.selected = false;
      if(contact.id == contactToSelect.id) {
        contact.selected = true;
        this.fireDB.setCurrentContact(contact);
      }
    });
  }

  /**
   * Gets the full name of contact.
   * @returns - Full name of contact.
   */
  protected fullName(contact: Contact):string {
    return `${contact.firstname} ${contact.lastname}`;
  }
  
/**
   * Opens a two way data stream between code and firebase collection 'contacts'.
   * 
   * @returns an @type Unsubscribe.
   */
  private getContactsSnapshot(): Unsubscribe {
    const q: Query = query(this.fireDB.getCollectionRef('contacts'), where('id', '!=', 'null'));
  
    return onSnapshot(q, (list) => {
      this.contacts = [];
      list.forEach((docRef) => {
        this.contacts.push(this.fireDB.mapResponseToContact({ ...docRef.data(), id: docRef.id}));
      });
      this.setContactGroups();
    });
  }

  /**
   * Assign all different groups to Array.
   * This happens in contact snapshot.
   */
  private setContactGroups() {
    this.groups = [];
    this.contacts.forEach((contact) => {
      if(!this.groups.includes(contact.group)) {
        this.groups.push(contact.group);
      }
    });
  }

  // #endregion methods
}