import { Component } from '@angular/core';
import { ContactListComponent } from './contact-list/contact-list.component';

@Component({
  selector: 'section[contacts]',
  imports: [
    ContactListComponent
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

}
