import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ContactIconComponent } from './../contact-icon/contact-icon.component';
import { FireContactService } from './../../../shared/services/fire-contact.service';
import { CommonModule } from '@angular/common';
import { Contact } from '../../../shared/classes/contact';

@Component({
  selector: 'app-edit-contact',
  imports: [ContactIconComponent, CommonModule],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})
export class EditContactComponent {

  private firestore: FireContactService = inject(FireContactService);

  @Input() contact: Contact | null = null;

  @Input() editModalState: 'closed' | 'open' = 'closed';

  @Output() closeModal = new EventEmitter<void>();

  onCloseModal() {
    this.closeModal.emit();
  }

  deleteContact() {
    this.onCloseModal(); 
  }

  saveContact() {
    this.onCloseModal(); 
  }
}