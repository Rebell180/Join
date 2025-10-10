import { inject, Injectable, OnDestroy } from '@angular/core';
import { addDoc, collection, CollectionReference, deleteDoc, doc, DocumentReference, Firestore, onSnapshot, query, Query, Unsubscribe, updateDoc, where } from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, filter, map, Observable } from 'rxjs';
import { addDoc, collection, CollectionReference, deleteDoc, doc, DocumentReference, Firestore, onSnapshot, query, Query, Unsubscribe, updateDoc, where } from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, filter, map, Observable } from 'rxjs';
import { Contact } from '../classes/contact';
import { ContactGroup } from '../classes/contactGroup';

/**
 * FireContactService is a service to manage communication between firebase database 
 * and this project
 * 
 * How to use: 
 *  If you need to use this service you add it simply in the constructor. 
 * 
 * Example: TODO rewrite
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

  // #region properties

  private contactsSubject = new BehaviorSubject<Array<Contact>>([]);
  contacts$ = this.contactsSubject.asObservable();

  private currentContactIdSubject = new BehaviorSubject<string | null>(null);
  currentContactId$ = this.currentContactIdSubject.asObservable();

  private unsubContacts: Unsubscribe;
  private firestore: Firestore = inject(Firestore);

  // #endregion properties

  constructor() {
    this.unsubContacts = this.subContactsList();
  }

  ngOnDestroy() {
    this.unsubContacts();
  }

  // #region methods



  /**
   * Subscribes firestore 'contacts' collection and keep
   * data updated with the latest snapshot.
   */
  private subContactsList() {
    const q: Query = query(this.getContactsRef(), where('id', '!=', 'null'));
    return onSnapshot(q, (list) => {
      const contacts: Contact[] = [];
      list.forEach((doc) => {
        contacts.push(this.mapResponseToContact({ ...doc.data(), id: doc.id }));
      });
      this.contactsSubject.next(contacts);
    });
  }

  /**
   * Sets the current contact ID.
   * The id will be used to get everytime the currentContact$ from contacts$.
   * 
   * @param id docId of contact
   */
  setCurrentContact(id: string | null) {
    this.currentContactIdSubject.next(id);
  }

  /**
   * Returns an observable with all unique groups 
   * of loaded contacts$.
   */
  getAllGroups$() {
    return this.contacts$.pipe(
      map(contacts => {
        const groups: Array<string> = contacts
          .map(c => c.group.toUpperCase()) // extract group values
          .filter(g => !!g); // !! remove undefined and null values
        // the reason for the usage of Array.from is to remove duplicates.
        // else we could return groups directly with duplicates.
        return Array.from(new Set(groups)).sort(); 
      })
    );
  }

  /**
   * Returns an observable with all contacts that match to the given group.
   * 
   * @param group The group string to filter contacts by
   */
  getContactsByGroup$(group: string) {
    return this.contacts$.pipe(
      map(contacts => contacts.filter(c => c.group === group))
    );
  }

  getContactGroups(): Observable<Array<ContactGroup>> {
    return this.getAllGroups$().pipe(
      map((groups: Array<string>) =>
        groups.map((group: string) => {
          const contactGroup = new ContactGroup();
          contactGroup.name = group;
          // Fülle die Kontakte synchron aus dem aktuellen contacts$-Value
          this.contacts$.pipe(
            map(contacts => contacts.filter(c => c.group.toUpperCase() === group))
          ).subscribe(contactsByGroup => {
            contactGroup.contactsBS.next(contactsByGroup);
          });
          return contactGroup;
        })
      )
    );
  }

  // #region CRUD

  /**
   * Adds a new contact to the Firestore collection.
   * 
   * @param contact The contact object to add.
   */
  async addContact(contact: Contact): Promise<void> {
    contact. group = contact.firstname[0];
    if(contact.firstname === '' || contact.lastname === '' || contact.email === '' || contact.tel === '') {
      return;
    }
    const newContactRef = await addDoc(this.getContactsRef(), contact.toJson());
    // update is important to get and save the id inside of component.
    if(newContactRef.id !== ''){
      await updateDoc(newContactRef, {id: newContactRef.id});
      this.setCurrentContact(newContactRef.id);
    }
  }

  /**
   * Updates an existing contact in firestore collection.
   * 
   * @param contact The contact object with data to update.
   */
  async updateContact(contact: Contact) {
    await updateDoc(this.getSingleContactRef(contact.id), contact.toJson());
  }

  /**
   * Deletes a contact from firestore collection.
   * 
   * @param contact The contact object to remove.
   */
  async deleteContact(contact: Contact) {
    await deleteDoc(this.getSingleContactRef(contact.id));
  }

  // #endregion CRUD

  /**
   * Returns the reference of 'contacts' collection.
   */
  private getContactsRef(): CollectionReference {
    const contactsCollection = collection(this.firestore, 'contacts');
    return contactsCollection;
  }

  /**
   * Returns the reference of a single contact.
   * 
   * @param docId Firestore document ID
   */
  private getSingleContactRef(docId: string): DocumentReference {
    const contactsRef = this.getContactsRef();
    return doc(contactsRef, `/${docId}`);
  }

  /**
   * Maps a doc object to a contact object.
   * 
   * @param obj data object of a document.
   */
  private mapResponseToContact(obj: any): Contact {
    return new Contact(obj);
  }

  // #endregion methods
}
