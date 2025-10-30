import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { DisplaySizeService, DisplayType } from '../../shared/services/display-size.service';
import { FirebaseDBService } from '../../shared/services/firebase-db.service';
import { ContactListComponent } from '../../shared/components/contact-list/contact-list.component';
import { ContactDetailComponent } from '../../shared/components/contact-detail/contact-detail.component';

@Component({
  selector: 'section[contacts]',
  imports: [
    ContactListComponent,
    ContactDetailComponent,
    AsyncPipe
],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  protected fireDB: FirebaseDBService = inject(FirebaseDBService);
  protected dss: DisplaySizeService = inject(DisplaySizeService);
  DisplayType = DisplayType;
}
