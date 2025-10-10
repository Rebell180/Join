import { Component, HostBinding, inject, Input, OnDestroy, OnInit, output, OutputEmitterRef } from '@angular/core';
import { Contact } from './../../../shared/classes/contact';
import { ContactIconComponent } from '../contact-icon/contact-icon.component';
import { FireContactService } from '../../../shared/services/fire-contact.service';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { ContactService } from '../../../shared/services/contact.service';


@Component({
  selector: 'section[contact-detail]',
  imports: [ContactIconComponent, CommonModule],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss'
})
export class ContactDetailComponent implements OnInit, OnDestroy {

  private firestore: FireContactService = inject(FireContactService);
  
  protected cs: ContactService = inject(ContactService);
  protected currentContact$: Observable<Contact | null> = this.cs.currentContact$;
  subCurrentContact!: Subscription;
  @HostBinding('class.d_none') isHidden:boolean = true;

  isMenuVisible: boolean = false;

  
  ngOnInit() {
    this.subCurrentContact = this.cs.currentContact$.subscribe(contact => {
      this.isHidden = !contact;
    })
  }

  ngOnDestroy(): void {
    
  }

  close() {
    this.isHidden = true;
  }

  toggleMenu(): void {
        this.isMenuVisible = !this.isMenuVisible;
    }
  
  deleteContact(contact: Contact) {
    this.firestore.deleteContact(contact); 
  }
}