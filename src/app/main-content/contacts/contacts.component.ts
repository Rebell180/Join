import { Component, inject, NgModule } from '@angular/core';
import { ContactListComponent } from './contact-list/contact-list.component';
import { AddContactComponent } from "../../shared/add-contact/add-contact.component";
import { ToastComponent } from "../../shared/toast/toast.component";
import { ContactDetailComponent } from "./contact-detail/contact-detail.component";
import { ContactService } from '../../shared/services/contact.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { DisplaySizeService, DisplayType } from '../../shared/services/display-size.service';

@Component({
  selector: 'section[contacts]',
  imports: [
    ContactListComponent,
    AddContactComponent,
    ContactDetailComponent,
    ToastComponent,
    NgIf,
    AsyncPipe
],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  cs: ContactService = inject(ContactService);
  dss: DisplaySizeService = inject(DisplaySizeService);
  DisplayType = DisplayType;
}
