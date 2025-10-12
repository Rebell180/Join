import { Component, inject,} from '@angular/core';
import { Contact } from './../../../shared/classes/contact';
import { ContactIconComponent } from '../contact-icon/contact-icon.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ContactService } from '../../../shared/services/contact.service';

@Component({
  selector: 'section[contact-detail]',
  imports: [ContactIconComponent, CommonModule],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss'
})
export class ContactDetailComponent {

  protected cs: ContactService = inject(ContactService);
  protected currentContact$: Observable<Contact | null> = this.cs.currentContact$;

  isMenuVisible: boolean = false;

  /** Shows and hide the mini menu for mobile devices. */
  toggleMenu(): void {
        this.isMenuVisible = !this.isMenuVisible;
    }

}