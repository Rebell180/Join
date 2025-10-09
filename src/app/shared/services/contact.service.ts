import { inject, Injectable, OnDestroy } from '@angular/core';
import { FireContactService } from './fire-contact.service';
import { Contact } from '../classes/contact';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ContactGroup } from '../classes/contactGroup';
import { DisplaySizeService, DisplayType } from './display-size.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService implements OnDestroy {

  // #region properties

  private fcs : FireContactService = inject(FireContactService);
  newContact: Contact = new Contact({ id: '', firstname: '', lastname: '', group: '', email: '', tel: '', iconColor: '' });
  private dss: DisplaySizeService = inject(DisplaySizeService);
  private curSize$: Observable<DisplayType> = this.dss.size();
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

  // fireContactService integration properties

  contactsBS: BehaviorSubject<Array<Contact>> = new BehaviorSubject(new Array<Contact>());
  contacts: Observable<Array<Contact>> = this.contactsBS.asObservable();
  contacts$ : Subscription = this.fcs.contacts$.subscribe((contactStream: Array<Contact>) => {
    this.contactsBS.next(contactStream.sort());
  });

  contactToEditBS: BehaviorSubject<Contact> = new BehaviorSubject(new Contact({ id: '', firstname: '', lastname: '', group: '', email: '', tel: '', iconColor: '' }));
  contactToEdit: Observable<Contact> = this.contactToEditBS.asObservable();  
  
  currentContactBS: BehaviorSubject<Contact> = new BehaviorSubject(new Contact({ id: '', firstname: '', lastname: '', group: '', email: '', tel: '', iconColor: '' }));
  currentContact: Observable<Contact> = this.currentContactBS.asObservable();
  currentContact$ = this.fcs.currentContact$.subscribe((contact: Contact) => {
    this.currentContactBS.next(contact);
    this.contactToEditBS.next(contact);
  });

  contactGroupsBS: BehaviorSubject<Array<string>> = new BehaviorSubject(new Array<string>());
  contactGroups: Observable<Array<string>> = this.contactGroupsBS.asObservable();
  contactGroups$ = this.fcs.getAllGroups$().subscribe((groups: Array<string>) => {
    this.contactGroupsBS.next(groups);
  });

  contactsByGroupBS: BehaviorSubject<Array<ContactGroup>> = new BehaviorSubject(new Array<ContactGroup>());
  contactsByGroup: Observable<Array<ContactGroup>> = this.contactsByGroupBS.asObservable();

  // #endregion properties

  constructor() { 
    this.contactsByGroup = this.fcs.getContactGroups();
    this.curSize$.subscribe(displayType => {
      if (displayType == DisplayType.MOBILE || displayType == DisplayType.TABLET) {
        this.closeDetail();
      } else {
        this.showDetail();
      }
    });
  }

  ngOnDestroy(): void {
    this.contacts$.unsubscribe();
    this.currentContact$.unsubscribe();
    this.contactGroups$.unsubscribe();
  }

  // #region methods

  // modal methods

  openModal(kindOfModal: string) {
    if(kindOfModal == 'add') {
      this.contactToEditBS.next(this.newContact);
      this.isEditModalOpenBS.next(false);
      this.isAddModalOpenBS.next(true);
      this.modalHeadlineTxtBS.next('Add');
      this.modalSaveBtnTxtBS.next('Create contact ✓');
    } else if (kindOfModal == 'edit') {
      this.contactToEdit = this.currentContact;
      this.isEditModalOpenBS.next(true);
      this.isAddModalOpenBS.next(false);
      this.modalHeadlineTxtBS.next('Edit');
      this.modalSaveBtnTxtBS.next('Save');
    }
  }

  closeModal() {
    this.isEditModalOpenBS.next(false);
    this.isAddModalOpenBS.next(false);
    this.modalHeadlineTxtBS.next('Add');
    this.modalSaveBtnTxtBS.next('Create contact ✓');
  }

  // contact list methods

  async selectContact(id: string) {
    this.showDetail();
    await this.contacts.forEach((contactStream) => {
      contactStream.forEach((contact) => {
        contact.selected = false;
        if(contact.id == id) {
          contact.selected = true;
          this.contactToEditBS.next(contact);
          this.setActiveContact(id);
        }
      });
    });
  }

  setActiveContact(id: string | null) {
    this.fcs.setCurrentContact(id);
  }

  // #region CRUD methods

  async addContactToDB(contact: Contact) {
    await this.fcs.addContact(contact);
  }

  async updateContactInDB(contact: Contact) {
    await this.fcs.updateContact(contact);
  }

  async deleteContactInDB(contact: Contact) {
    await this.fcs.deleteContact(contact);
  }

  // #endregion CRUD methods

  // contact detail methods

  closeDetail() {
    this.classToDisplayBS.next("d_none");
  }

  showDetail() {
    this.classToDisplayBS.next("");
  }


  // #endregion methods
}
