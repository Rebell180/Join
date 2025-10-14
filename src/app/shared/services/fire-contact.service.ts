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
export class FireContactService {
  
  // #region properties
  
  private contactsSubject = new BehaviorSubject<Array<Contact>>([]);
  private contacts$ = this.contactsSubject.asObservable();
  
  // private unsubContacts: Unsubscribe;
  
  // #endregion properties

  constructor() {
  
  // #region groups
  /**
   * Returns an observable with all contacts that match to the given group.
   * 
   * @param group The group string to filter contacts by
   */
  // getContactsByGroup$(group: string) {
  //   return this.contacts$.pipe(
  //     map(contacts => contacts.filter(c => c.group === group))
  //   );
  // }

  // #endregion
  // #endregion methods
  }
}
