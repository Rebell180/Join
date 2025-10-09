import { Component, inject, Input, output, OutputEmitterRef } from '@angular/core';
import { Contact } from './../../../shared/classes/contact';
import { ContactIconComponent } from '../contact-icon/contact-icon.component';
import { FireContactService } from '../../../shared/services/fire-contact.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ContactService } from '../../../shared/services/contact.service';


@Component({
  selector: 'app-contact-detail',
  imports: [ContactIconComponent, CommonModule],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss'
})
export class ContactDetailComponent {

  private firestore: FireContactService = inject(FireContactService);
  cs: ContactService = inject(ContactService);

  openEditModal: OutputEmitterRef<Observable<Contact>> = output<Observable<Contact>>();

  contact$: Observable<Contact> = this.firestore.currentContact$;

  classToDisplayBS: string = "";
  
  isMenuVisible: boolean = false;

  constructor() {

  }

  toggleMenu(): void {
        this.isMenuVisible = !this.isMenuVisible;
    }
  
  deleteContact(contact: Contact) {
    this.firestore.deleteContact(contact); 
  }

  openModal() {
    this.openEditModal.emit(this.contact$);
  }
}