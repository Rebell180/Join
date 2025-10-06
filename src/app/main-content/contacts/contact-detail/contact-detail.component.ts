import { Component, inject, output, OutputEmitterRef } from '@angular/core';
import { Contact } from './../../../shared/classes/contact';
import { ContactIconComponent } from '../contact-icon/contact-icon.component';
import { FireContactService } from '../../../shared/services/fire-contact.service';
import { CommonModule } from '@angular/common';
import { EditContactComponent } from "../edit-contact/edit-contact.component";
import { filter, Observable } from 'rxjs';


@Component({
  selector: 'app-contact-detail',
  imports: [ContactIconComponent, CommonModule],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss'
})
export class ContactDetailComponent {

  private firestore: FireContactService = inject(FireContactService);

  openEditModal: OutputEmitterRef<Observable<Contact>> = output<Observable<Contact>>();

  contact$: Observable<Contact> = this.firestore.currentContact$;
  
  isMenuVisible: boolean = false;
  editModalState: 'closed' | 'open' = 'closed';

  toggleMenu(): void {
        this.isMenuVisible = !this.isMenuVisible;
    }

  handleModalClose() {
      this.editModalState = 'closed';
    }
  
  deleteContact(contact: Contact) {
    this.firestore.deleteContact(contact); 
    this.editModalState = 'closed';
  }

  openModal() {
    this.openEditModal.emit(this.contact$);
  }
}
//this.firestore.currentContact anstatt contact.
// output schreiben