import { inject, Injectable, OnDestroy } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { Contact } from '../models/Contact';

/***
 * FireContactService is a service to manage communication between firebase database 
 * and this project
 * 
 * How to use: 
 *  If you need to use this service you add it simply in the constructor. 
 * 
 * Example: 
 * 
 * constructor(private contactService: FireContactService) {
 *   this.contactList = this.getContacts();
 * }
 *
 * getContacts(): Contact[] {
 *   return this.contactService.contacts;
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class FireContactService implements OnDestroy {

  contacts: Array<Contact> = [];
  firestore = inject(Firestore);
  
  unsubContacts;

  constructor() {
      this.unsubContacts = this.subContactsList();
      console.log(this.firestore.app);
  }

  ngOnDestroy() {
    this.unsubContacts();
  }

  /**
   * Adds a new contact to the database.
   * 
   * @param contact the contact object to add as Json.
   */
  async addContact(contact: Contact) {
    await addDoc(this.getContactsRef(), contact.toJson());
  }

  /**
   * Updates a single contact in database.
   * 
   * @param contact the contact to update in database.
   */
  async updateContact(contact: Contact) {
    contact.firstname = "changed";
    const ref = this.getSingleContactRef('contacts', contact.id);
    await updateDoc(ref, contact.toJson());
  }

  /**
   * Deletes a spezific contact from database.
   * 
   * @param contact the spezific contact to delete.
   */
  async deleteContact(contact: Contact) {
    await deleteDoc(this.getSingleContactRef('contacts', contact.id)); 
  }

  /**
   * Returns a snapshot wich get every time the current data from db and
   * push the result items into the Array<Contact>.
   * 
   * @returns a snapshot
   */
  subContactsList() {
    return onSnapshot(this.getContactsRef(), (list) => {
      this.contacts = [];
      list.forEach(element => {
        this.contacts.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  /**
   * Returns the contacts collection reference. 
   * 
   * @returns collectionReference of contacts from database.
   */
  getContactsRef() {
    return collection(this.firestore, 'contacts');
  }

  /**
   * Returns a single document of a collection in database.
   * 
   * @param colId id of collection
   * @param docId id of document in collection
   * @returns 
   */
  getSingleContactRef(colId: string, docId: string) {
    return doc(this.firestore, colId, docId);
  }
  
  /**
   * Creates an single contact object from database-object
   *  
   * @param obj object from database. 
   * @param id id from object.
   * @returns returns the created contact object.
   */
  setNoteObject(obj: any, id: string): Contact {
    const contact = new Contact();
    contact.id = id;
    contact.firstname = obj.firstname;
    contact.lastname = obj.lastname;
    contact.email = obj.email;
    contact.telnr = obj.telnr;
    contact.group = obj.firstname[0];

    return contact;
  }
}
