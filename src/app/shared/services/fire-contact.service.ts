import { inject, Injectable, OnDestroy } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, onSnapshot, Unsubscribe, updateDoc } from '@angular/fire/firestore';
import { Contact } from '../classes/contact';

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

  private contacts: Array<Contact> = [];
  private firestore: Firestore = inject(Firestore);
  
  unsubContacts: Unsubscribe;

  constructor() {
      this.unsubContacts = this.subContactsList();
  }

  /**
   * On Destroy, we have to unsubscribe our snapshots.
   */
  ngOnDestroy() {
    this.unsubContacts();
  }

  /**
   * Return and Array<Contact>
   * @returns an array of all loaded Contact-objects 
   */
  getContacts() {
    return this.contacts;
  }

  /**
   * Filters the current loaded Contact-object-List for the group of them.
   *  
   * @param group the group to filter contacts.
   * @returns an Array of Contact-objects filtered by group
   */
  getContactsByGroup(group: string) {
    const sortedList = this.contacts.filter((contact) => contact.group == group);
    return sortedList;
  }

  /**
   * Adds a new contact to the database.
   * 
   * @param contact the contact object to add as Json.
   */
  async addContact(contact: Contact) {
    const colRef = this.getContactsRef();
    return await addDoc(colRef, contact.toJson());
  }

  /**
   * Updates a single contact in database.
   * 
   * @param contact the contact to update in database.
   */
  async updateContact(contact: Contact) {
    const docRef = this.getSingleContactRef(contact.id);
    await updateDoc(docRef, contact.toJson());
  }

  /**
   * Deletes a spezific contact from database.
   * 
   * @param contact the spezific contact to delete.
   */
  async deleteContact(contact: Contact) {
    const docRef = this.getSingleContactRef(contact.id);
    await deleteDoc(docRef); 
  }

  /**
   * Returns a snapshot wich get every time the current data from db and
   * push the result items into the Array<Contact>.
   * 
   * @returns a snapshot
   */
  subContactsList() {
    return onSnapshot(this.getContactsRef(), (resultList) => {
      this.contacts = [];
      resultList.forEach(contact => {
        this.contacts.push(this.mapResponseToContact(contact.data()));
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
   * @param docId id of document in collection
   * @returns 
   */
  getSingleContactRef(docId: string) {
    return doc(this.firestore, 'contacts', docId);
  }
  
  /**
   * Creates an single contact object from database-object
   *  
   * @param obj object from database.
   * @returns returns the created contact object.
   */
  mapResponseToContact(obj: any): Contact {
    const contact = new Contact(obj);
    return contact;
  }
}
