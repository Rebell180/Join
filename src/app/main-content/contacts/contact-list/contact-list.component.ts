import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ContactGroupComponent } from './contact-group/contact-group.component';
import { Contact } from '../../../shared/classes/contact';
import { FireContactService } from '../../../shared/services/fire-contact.service';
import { FormsModule } from "@angular/forms";
import { Observable } from 'rxjs';


@Component({
  selector: 'app-contact-list',
  imports: [
    CommonModule,
    ContactGroupComponent,
    FormsModule
],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent {
  fireContactService: FireContactService = inject(FireContactService);
  groups$ : Observable<Array<string>> = this.fireContactService.getAllGroups$();
  contacts$ : Observable<Array<Contact>> = this.fireContactService.contacts$;
}