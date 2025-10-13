import { Injectable, OnDestroy } from '@angular/core';
import { onSnapshot, query, Query, Unsubscribe, where } from '@angular/fire/firestore';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Contact } from '../classes/contact';
import { ContactGroup } from '../classes/contactGroup';
import { FireService } from './fire.service';

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
/** Manges the Firestore-Handling between contacts. */
export class FireContactService extends FireService<Contact> implements OnDestroy{
  
  // #region properties
  
  private contactsSubject = new BehaviorSubject<Array<Contact>>([]);
  private contacts$ = this.contactsSubject.asObservable();
  
  private unsubContacts: Unsubscribe;
  
  // #endregion properties

  constructor() {
    super();
    this.unsubContacts = this.subContactsList();
  }

  /** Unsubscribes contact list observable. */
  ngOnDestroy() {
    this.unsubContacts();
  }

  // #region methods
  // #region genaral
  /**
   * Subscribes firestore 'contacts' collection and keep
   * data updated with the latest snapshot.
   */
  private subContactsList() {
    const q: Query = query(this.getCollectionRef('contacts'), where('id', '!=', 'null'));
    return onSnapshot(q, (list) => {
      const contacts: Contact[] = [];
      list.forEach((doc) => {
        contacts.push(this.mapResponseToContact({ ...doc.data(), id: doc.id }));
      });
      contacts.sort((a, b) => a.firstname.localeCompare(b.firstname));
      this.contactsSubject.next(contacts);
    });
  }
  
  
  /**
   * Maps a doc object to a contact object.
   * @param obj data object of a document as JSON-Format.
   * @returns - Contact-Intance of JSON-Format in database.
   */
  private mapResponseToContact(obj: any): Contact {
    return new Contact(obj);
  }

  /**
   * Leads all contacts from database.
   * @returns - Contactlist as Obervable.
   */
  getAll():Observable<Contact[]> {
    return this.contacts$;
  }
  // #endregion

  // #region groups
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

  /**
   * Gets the asigned groups of contact.
   * @returns - All groups of contact as obervable.
   */
  // getContactGroups(): Observable<Array<ContactGroup>> {
  //   return this.getAllGroups$().pipe(
  //     map((groups: Array<string>) =>
  //       groups.map((group: string) => {
          // const contactGroup = new ContactGroup();
          // contactGroup.name = group;
          // Fülle die Kontakte synchron aus dem aktuellen contacts$-Value
  //         this.contacts$.pipe(
  //           map(contacts => contacts.filter(c => c.group.toUpperCase() === group))
  //         ).subscribe(contactsByGroup => {
  //           contactGroup.contactsBS.next(contactsByGroup);
  //         });
  //         return contactGroup;
  //       })
  //     )
  //   );
  // }
  // #endregion
  // #endregion methods
}
