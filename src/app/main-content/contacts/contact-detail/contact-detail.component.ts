import { Component, inject, input, InputSignal,} from '@angular/core';
import { Contact } from './../../../shared/classes/contact';
import { ContactIconComponent } from '../../../shared/components/contact-icon/contact-icon.component';
import { CommonModule } from '@angular/common';
import { FirebaseDBService } from '../../../shared/services/firebase-db.service';
import { ModalService } from '../../../shared/services/modal.service';
import { ToastMsgService } from '../../../shared/services/toast-msg.service';

@Component({
  selector: 'section[contact-detail]',
  imports: [ContactIconComponent, CommonModule],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss'
})
export class ContactDetailComponent {

  // #region properties

  protected fireDB: FirebaseDBService = inject(FirebaseDBService);
  protected modalService: ModalService = inject(ModalService);
  private tms: ToastMsgService = inject(ToastMsgService);

  isMenuVisible: boolean = false;

  // #endregion properties

  // #region methods

  /** Shows and hide the mini menu for mobile devices. */
  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  /**
   * Sets the current contact to a new one, which hides contact information
   * 
   * There is a binding in html to id of current contact.
   */
  unselectContact() {
    this.fireDB.setCurrentContact(new Contact);
  }

  /**
   * deletes a spezific contact in database. 
   * @param docId the contact id to delete in database.
   */
  async deleteContact(doc: Contact) {
    this.fireDB.deleteInDB('contacts', doc);
    this.fireDB.setCurrentContact(new Contact());
    this.tms.add('Contact deleted', 3000, 'success');
  }

  // #endregion methods
}