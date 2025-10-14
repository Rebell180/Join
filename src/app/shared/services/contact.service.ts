import { inject, Injectable, OnDestroy } from '@angular/core';
import { Contact } from '../classes/contact';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { ContactGroup } from '../classes/contactGroup';
import { DisplaySizeService, DisplayType } from './display-size.service';
import { collectionData } from '@angular/fire/firestore';
import { FireService } from './fire.service';

@Injectable({
  providedIn: 'root'
})
/** Handles the contact mangegement. */
export class ContactService extends FireService<Contact> implements OnDestroy {

  // #region properties

  private dss: DisplaySizeService = inject(DisplaySizeService);

  // Contact List
  private contacts$!: Observable<Contact[]>;
  private currentContactSubject: BehaviorSubject<Contact | null> = new BehaviorSubject<Contact | null>(null);
  private currentContact: Observable<Contact | null> = this.currentContactSubject.asObservable();
  // add or edit contact modal properties 

  private isEditModalOpenBS: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isEditModalOpen: Observable<boolean> = this.isEditModalOpenBS.asObservable();
  private isAddModalOpenBS: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isAddModalOpen: Observable<boolean> = this.isAddModalOpenBS.asObservable();
  private modalHeadlineTxtBS: BehaviorSubject<string> = new BehaviorSubject('Add');
  modalHeadlineTxt: Observable<string> = this.modalHeadlineTxtBS.asObservable();
  private modalSaveBtnTxtBS: BehaviorSubject<string> = new BehaviorSubject('Create contact ✓');
  modalSaveBtnTxt: Observable<string> = this.modalSaveBtnTxtBS.asObservable();

  //  contact-detail

  private classToDisplayBS: BehaviorSubject<string> = new BehaviorSubject('');
  classToDisplay$: Observable<string> = this.classToDisplayBS.asObservable();

  curSize$: Subscription;

    //   this.contactsBS.next(contactStream.sort());
  // });

  contactToEditBS: BehaviorSubject<Contact> = new BehaviorSubject(new Contact({ id: '', firstname: '', lastname: '', group: '', email: '', tel: '', iconColor: '' }));
  contactToEdit: Observable<Contact> = this.contactToEditBS.asObservable();

  private currentContactBS: BehaviorSubject<Contact | null> = new BehaviorSubject<Contact | null>(null);;
  currentContact$: Observable<Contact | null> = this.currentContactBS.asObservable();

  contactGroupsBS: BehaviorSubject<Array<string>> = new BehaviorSubject(new Array<string>());
  contactGroups: Observable<Array<string>> = this.contactGroupsBS.asObservable();
  // contactGroups$ = this.fcs.getAllGroups$().subscribe((groups: Array<string>) => {
  //   this.contactGroupsBS.next(groups);
  // });

  contactsByGroupBS: BehaviorSubject<Array<ContactGroup>> = new BehaviorSubject(new Array<ContactGroup>());
  contactsByGroup: Observable<Array<ContactGroup>> = this.contactsByGroupBS.asObservable();

  // #endregion properties

  constructor() {
    super();
    this.loadContacts();
    this.curSize$ = this.subscribeWindowSize();
  }

  /** Unsubribes all subcriptionss. */
  ngOnDestroy(): void {
    // this.contacts$.unsubscribe();
    // this.contactGroups$.unsubscribe();
    this.curSize$.unsubscribe();
  }

  // #region methods
  /** Loads all contacts. */
  private loadContacts(): void {
    this.contacts$ = collectionData(this.getCollectionRef('contacts'), { idField: 'id' }).pipe(
      map(docs => docs.map(data => new Contact({ id: data.id, firstname: data['firstname'], lastname: data['lastname'], group: data['group'], email: data['email'], tel: data['tel'], iconColor: data['iconColor'] })))
    );
  }

  // detail methods

  /** Subscribes the window size form DisplaySizeService. */
  subscribeWindowSize() {
    return this.dss.size().subscribe((size) => {
      if (size = DisplayType.NOTEBOOK) {
        this.classToDisplayBS.next('d_none');
      }
      else if (size == DisplayType.DESKTOP) {
        this.classToDisplayBS.next('');
      }
    });
  }

  // #region modals
  /**
   * Opens a modal.
   * @param kindOfModal - 'add' or 'edit
   */
  openModal(kindOfModal: string) {
    if (kindOfModal == 'add') {
      this.contactToEditBS.next(new Contact({ id: '', firstname: '', lastname: '', group: '', email: '', tel: '', iconColor: '' }));
      this.isEditModalOpenBS.next(false);
      this.isAddModalOpenBS.next(true);
      this.modalHeadlineTxtBS.next('Add');
      this.modalSaveBtnTxtBS.next('Create contact ✓');

    } else if (kindOfModal == 'edit') {
      this.contactToEditBS.next(this.currentContactBS.value);
      this.isEditModalOpenBS.next(true);
      this.isAddModalOpenBS.next(false);
      this.modalHeadlineTxtBS.next('Edit');
      this.modalSaveBtnTxtBS.next('Save');
    }
  }

  /** Closes a Modal. */
  closeModal() {
    this.isEditModalOpenBS.next(false);
    this.isAddModalOpenBS.next(false);
    this.modalHeadlineTxtBS.next('Add');
    this.modalSaveBtnTxtBS.next('Create contact ✓');
  }
  // #endregion

  // #region ContactList
  /**
   * Selects a contact.
   * @param contact - Contact to select, null for unselect.
   */
  async selectContact(contact: Contact | null = null) {
    await this.contacts$.forEach((contactStream) => {
      contactStream.forEach((contactO) => {
        contactO.selectedInContactList = false;
        if (contactO.equals(contact)) {
          contactO.selectedInContactList = true;
          this.contactToEditBS.next(contactO);
          this.currentContactBS.next(contactO)
          this.classToDisplayBS.next('');
          this.currentContactSubject.next(contact);
        }
      });
    });
  }

  /**
   * Disables a contact.
   * @param id - Id of contact.
   */
  unselectCurrentContact(id: string) {
    this.contacts$.forEach((contactStream) => {
    contactStream.forEach((contact) => {
    if(contact.id == id) {
      contact.selectedInContactList = false;
    }
    });
    });
  }
  // #endregion

  // Detail methods
  /**
   * Assigns a CSS-Class for ContactDetail.
   * @param {string} classname - CSS-Class for Style, 'd_none' or ''.
   */
  setDetailVisibility(classname: 'd_none' | '') {
    this.classToDisplayBS.next(classname);
    if (this.currentContactBS.value) {
      this.unselectCurrentContact(this.currentContactBS.value.id);
      this.currentContactBS.next(null);
    }
  }

  // region Groups
  /**
   * Gets all groups.
   * @returns - All group as Observable.
   */
  getAllGroups(): Observable<ContactGroup[]> {
    return this.contacts$.pipe((
      map(contacts => {
        const groups = contacts.map(contact => contact.group);
        const nonEmpty = groups.filter(g => g.length > 0);
        const letterList = Array.from(new Set(nonEmpty));
        return letterList.map(letter => new ContactGroup(this, letter))
      })
    ))
  }
  // #endregion

  // #region CRUD methods
  getAll(): Observable<Contact[]> {
    return this.contacts$
  }
  /**
   * Adds a contact into database.
   * @param contact - Contact for add to database.
   */
  async addContactToDB(contact: Contact) {
    await this.add(contact);
  }

  /**
   * Updates a contact in Database.
   * @param contact - Contact for update in database.
   */
  async updateContactInDB(contact: Contact) {
    await this.update(contact);
  }

  /**
   * Deletes a contact from database.
   * @param contact - Contact to delete
   */
  async deleteContactInDB(contact: Contact) {
    await this.delete(contact);
  }
  // #endregion CRUD methods
  // #endregion methods
}
