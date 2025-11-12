import { Component, inject, AfterViewInit, input, InputSignal, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ContactIconComponent } from "./../../contact-icon/contact-icon.component";
import { Contact } from '../../../classes/contact';
import { FirebaseDBService } from '../../../services/firebase-db.service';
import { ToastMsgService } from '../../../services/toast-msg.service';
import { ValidationService } from '../../../services/validation.service';
import { ContactFields } from '../../../enums/contact-fields';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [CommonModule, ContactIconComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss',
  animations: [
    trigger('slideInOut', [
      state('open', style({
        transform: 'translateX(0)',
        opacity: 1,
      })),
      state('closed', style({
        transform: 'translateX(100vw)',
        opacity: 0,
      })),
      transition('closed => open', [
        animate('500ms ease-out')
      ]),
      transition('open => closed', [
        animate('400ms ease-in')
      ])
    ])
  ]
})
export class AddContactComponent implements OnInit, AfterViewInit {
  // #region properties

  contact: InputSignal<Contact> = input.required<Contact>();
  headlineTxt: InputSignal<string> = input.required<string>();
  submitBtnTxt: InputSignal<string> = input.required<string>();

  protected vds: ValidationService = inject(ValidationService);
  private fireDB: FirebaseDBService = inject(FirebaseDBService);
  private tms: ToastMsgService = inject(ToastMsgService);
  
  ContactFields = ContactFields;
  
  isOpen = false;
  protected formContact: Contact = new Contact();
  
  /** callback function on close => remove from DOM => will be set in ModalService */
  dissolve?: () => void;

  // #endregion properties
  
  ngOnInit(): void {
    const c = this.contact();
    this.formContact = c ? { ...c } as Contact : this.formContact;
  }

  ngAfterViewInit() {
    setTimeout(() => this.isOpen = true, 10); // Animation trigger
  }

  // #region methods
  async changeInput(inputName: ContactFields, value: string) {
    // validate: with service
    switch(inputName) {
      case ContactFields.FIRSTNAME:
        // validate 
        break;
      case ContactFields.LASTNAME:
        // validate
        break;
      case ContactFields.EMAIL:
        // validate
        break;
      case ContactFields.PHONE:
        // validate
        break;
      default:
        break;
    }
  }

  /**
   * Changes current focus.
   * @param index - Index of value in fields-array;
  */
  focusOnInput (inputname: string): void {
  }

  /**
   * Decides if error message is shown.
   * @param index - Index of Field-Array
   * @returns true, if user passed this entry in form.
   */
  showError(index: number): boolean {
    return false;
  }

  /** 
   * Submit the entered data as add or as update after validation 
   */
  async submitForm() {
    // this.validateForm();
    const orig = this.contact();
    if (!orig || orig.id == '') {
      await this.fireDB.addToDB('contacts', this.formContact);
      this.tms.add('Contact was created', 3000, 'success');
    } else {
      Object.assign(orig, this.formContact);
      await this.fireDB.updateInDB('contacts', orig);
      this.fireDB.setCurrentContact(orig);
      this.tms.add('Contact was updated', 3000, 'success');
    }
    this.closeModal();
  }
  
  /**
   * Closes the modal
   * 
   * Use a timeout to defer the close function for animation.
   */
  closeModal() {
    this.isOpen = false;
    setTimeout(() => this.dissolve?.(), 400);
  }

  /**
   * Deletes a single entry in database.
   */
  async deleteContact() {
    await this.fireDB.deleteInDB('contacts', this.contact());
    this.tms.add('Contect deleted', 3000, 'success');
  }

  // #endregion methods
}
