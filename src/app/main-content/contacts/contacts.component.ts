import { Component, inject } from '@angular/core';
import { ContactListComponent } from './contact-list/contact-list.component';
import { AddContactComponent } from "../../shared/add-contact/add-contact.component";
import { Contact } from '../../shared/classes/contact';
import { ToastComponent } from "../../shared/toast/toast.component";
import { ContactDetailComponent } from "./contact-detail/contact-detail.component";
import { FireContactService } from '../../shared/services/fire-contact.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'section[contacts]',
  imports: [
    ContactListComponent,
    AddContactComponent,
    ContactDetailComponent,
    ToastComponent
],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  fireContactService : FireContactService = inject(FireContactService);
  modalVisiblity: "hidden" | "visible" = "hidden";  
  kindOfModal: string = "add";
  contact: Observable<Contact> = this.fireContactService.currentContact$;

  toggleAddContactModal() {
    if(this.modalVisiblity === "hidden"){
      this.modalVisiblity = "visible";

    } else {
      this.modalVisiblity = "hidden";
      this.kindOfModal = 'add';
    }
  }

  editContact(contact: Observable<Contact>) {
    this.contact = this.fireContactService.currentContact$;
    this.kindOfModal = 'edit';
    this.toggleAddContactModal();
  }
}
