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
  @ViewChild('myInput') myInputRef!: ElementRef<HTMLInputElement>;
  // TODO MARCEL -> Childs for Inputs to get value over Native Element Ref for validate and dad and update

  /** Inputs will set in ModalService */
  contact: InputSignal<Contact> = input.required<Contact>();
  headlineTxt: InputSignal<string> = input.required<string>();
  submitBtnTxt: InputSignal<string> = input.required<string>();
  ContactFields = ContactFields;
  /** callback function on close => remove from DOM => will be set in ModalService */
  dissolve?: () => void;

  protected vds: ValidationService = inject(ValidationService);
  private fireDB: FirebaseDBService = inject(FirebaseDBService);
  private tms: ToastMsgService = inject(ToastMsgService);
  
  isOpen = false;

  // #endregion properties
  
  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    setTimeout(() => this.isOpen = true, 10); // Animation trigger
  }

  // #region methods
  // #region Form-Management
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

  /** Submit the entered data as add or as update after validation */
  async submitForm() {
    // this.validateForm();
    const contact = this.contact();
    // contact.firstname = document.
    if(contact.id == '') {
      await this.fireDB.addToDB('contacts', contact);
      this.tms.add('Contact was created', 3000, 'success');
    } else {
      await this.fireDB.updateInDB('contacts', contact);
      this.tms.add('Contact was updated', 3000, 'success');
    }
    this.closeModal();
  }
  // #endregion
  
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
