import { Component, inject, AfterViewInit, input, InputSignal, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ContactIconComponent } from "./../../contact-icon/contact-icon.component";
import { Contact } from '../../../classes/contact';
import { FirebaseDBService } from '../../../services/firebase-db.service';
import { ToastMsgService } from '../../../services/toast-msg.service';
import { ValidationService } from '../../../services/validation.service';
import { Subscription } from 'rxjs';
import { CustomValidator } from '../../../classes/custom-validator';

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
export class AddContactComponent implements OnInit, AfterViewInit, OnDestroy {

  // #region properties

  /** Inputs will set in ModalService */
  contact: InputSignal<Contact> = input.required<Contact>();
  headlineTxt: InputSignal<string> = input.required<string>();
  submitBtnTxt: InputSignal<string> = input.required<string>();

  /** callback function on close => remove from DOM => will be set in ModalService */
  dissolve?: () => void;
  subFormCahange ?:Subscription;

  private fireDB: FirebaseDBService = inject(FirebaseDBService);
  private tms: ToastMsgService = inject(ToastMsgService);
  private fb: FormBuilder = inject(FormBuilder);
  private val: ValidationService = inject(ValidationService);
  
  isOpen = false;

  protected contactForm: FormGroup = this.fb.group({
    firstname: ['', [CustomValidator.strictRequired(), CustomValidator.firstUpperCase(), Validators.minLength(3)]],
    lastname: ['', [CustomValidator.strictRequired(), CustomValidator.firstUpperCase(), Validators.minLength(3)]],
    email: ['', [CustomValidator.strictRequired(), Validators.minLength(10), Validators.email]],
    tel: ['', [CustomValidator.strictRequired(), Validators.minLength(10), CustomValidator.tel()]]
  })
  errors: Record<string, string[]> = {};

  // #endregion properties
  
  ngOnInit(): void {
    const {id, group, iconColor, ...formdata} = this.contact().toJSON();
    this.contactForm.setValue(formdata);
    this.val.registerForm('contact', this.contactForm);
    this.subFormCahange = this.contactForm.valueChanges.subscribe(() => {this.validateForm();});
    
  }

  ngAfterViewInit() {
    setTimeout(() => this.isOpen = true, 10); // Animation trigger
  }

  ngOnDestroy(): void {
    this.subFormCahange?.unsubscribe();
    this.val.removeForm('contact');
  }

  // #region methods

  /**
   * Closes the modal
   * 
   * Use a timeout to defer the close function for animation.
   */
  closeModal() {
    this.isOpen = false;
    setTimeout(() => this.dissolve?.(), 400);
  }

  private validateForm() {
    this.errors = this.val.validateForm('contact');
  }

  /**
   * Submit the entered data as add or as update after validation
   *  
   * @param e event
   */
  async submitForm() {
    this.validateForm();
    if (this.contactForm.valid) {
      const values = this.contactForm.value;
      this.contact().firstname = values.firstname;
      this.contact().lastname = values.lastname;
      this.contact().email = values.email;
      this.contact().tel = values.tel;
      if(this.contact().id == '') {
        await this.fireDB.addToDB('contacts', this.contact());
        this.tms.add('Contact was created', 3000, 'success');
      } else {
        await this.fireDB.updateInDB('contacts', this.contact());
        this.tms.add('Contact was updated', 3000, 'success');
      }
      this.closeModal();
    }
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
