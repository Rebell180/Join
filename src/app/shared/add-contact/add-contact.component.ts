import { Component, ElementRef, inject, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { Contact } from '../classes/contact';
import { FormsModule } from '@angular/forms';
import { ToastMsgService } from '../services/toast-msg.service';
import { CommonModule } from '@angular/common';
import { ContactService } from '../services/contact.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent{

  cs: ContactService = inject(ContactService);
  defaultContact: Observable<Contact> = this.cs.contactToEdit;
  private renderer: Renderer2 = inject(Renderer2);
  
  errors: boolean[] = [false, false, false, false];
  @ViewChildren('errEl') errorRefs!: QueryList<ElementRef<HTMLDivElement>>;
  

  getInputElementValue(elementId: string) {
    const inputRef = document.getElementById(elementId) as HTMLInputElement;
    if (inputRef) {
      return inputRef.value;
    } else {
      return '';
    }
  }

  closeModal () {
    this.cs.closeModal();
  }

  async submitForm(e:SubmitEvent) {
    e.preventDefault();
    if (this.validateAll()) {
      this.cs.contactToEdit.forEach(async (contact) => {
        if(contact.id == '') {
          await this.cs.addContactToDB(contact);
        } else {
          await this.cs.updateContactInDB(contact);
        }
      });
      this.closeModal();
    }
  }
  
  // #region validation 

  /** Validates firstname. */
  protected validateFirstName(): void {
    const contactInForm: Observable<Contact> = this.cs.contactToEdit;
    let valueToValidate: string = '';
    contactInForm.forEach((contact: Contact) => {
      valueToValidate = contact.firstname;
    });

    const errors:boolean[] = [];
    const name: string = 'Firstname';
    // const field: string = this.cs.contactToEdit.firstName;
    const errorRef: ElementRef<HTMLDivElement> = this.errorRefs.toArray()[0];
    const pattern: RegExp = /^([A-ZÄÖÜ][a-zäöüß]*\s?-?)*$/g;
    errors.push(this.checkRequired(name, valueToValidate, errorRef));
    if (errors.includes(false)) return
    errors.push(this.checkMinLength(name, valueToValidate, 3, errorRef));
    if (errors.includes(false)) return
    errors.push(this.checkFormat(name, valueToValidate, pattern, errorRef));
    this.errors[0] = errors.every(e => e);
  }

  /** Validates lastname. */
  protected validateLastName(): void {
    const contactInForm: Observable<Contact> = this.cs.contactToEdit;
    let valueToValidate: string = '';
    contactInForm.forEach((contact: Contact) => {
      valueToValidate = contact.lastname;
    });

    const errors:boolean[] = [];
    const name: string = 'Lastname';
    // const field: string = this.contactForm.lastName;
    const errorRef: ElementRef<HTMLDivElement> = this.errorRefs.toArray()[1];
    const pattern: RegExp = /^([A-ZÄÖÜ][a-zäöüß]*\s?-?)*$/g;
    errors.push(this.checkRequired(name, valueToValidate, errorRef))
    if (errors.includes(false)) return
    errors.push(this.checkMinLength(name, valueToValidate, 3, errorRef));
    if (errors.includes(false)) return
    errors.push(this.checkFormat(name, valueToValidate, pattern, errorRef));
    this.errors[1] = errors.every(e => e);
  }

  /** Validates e-mail. */
  protected validateEmail(): void {
    const contactInForm: Observable<Contact> = this.cs.contactToEdit;
    let valueToValidate: string = '';
    contactInForm.forEach((contact: Contact) => {
      valueToValidate = contact.email;
    });

    const errors:boolean[] = [];
    const name: string = 'E-Mail';
    // const field: string = this.contactForm.email;
    const errorRef: ElementRef<HTMLDivElement> = this.errorRefs.toArray()[2];
    const pattern: RegExp = /^\w*(\.?-?\w*)*?@\w*\.[a-z]{2,3}$/g;
    errors.push(this.checkRequired(name, valueToValidate, errorRef));
    if (errors.includes(false)) return
    errors.push(this.checkMinLength(name, valueToValidate, 3, errorRef));
    if (errors.includes(false)) return
    errors.push(this.checkFormat(name, valueToValidate, pattern, errorRef));
    this.errors[2] = errors.every(e => e);
  }

  /** Validates tel-number. */
  protected validateTel(): void {
    const contactInForm: Observable<Contact> = this.cs.contactToEdit;
    let valueToValidate: string = '';
    contactInForm.forEach((contact: Contact) => {
      valueToValidate = contact.tel;
    });

    const errors:boolean[] = [];
    const name: string = 'Tel-Number';
    // const field: string = this.contactForm.tel;
    const errorRef: ElementRef<HTMLDivElement> = this.errorRefs.toArray()[3];
    const pattern: RegExp = /^(?:\+49|0049|0)[ \-]?(?:\(?\d{1,5}\)?[ \-]?)?\d{3,11}$/;
    errors.push(this.checkRequired(name, valueToValidate, errorRef));
    if (errors.includes(false)) return
    errors.push(this.checkMinLength(name, valueToValidate, 3, errorRef));
    if (errors.includes(false)) return
    errors.push(this.checkFormat(name, valueToValidate, pattern, errorRef));
    this.errors[3] = errors.every(e => e);
  }

  private validateAll(): boolean {
    this.validateFirstName();
    this.validateLastName();
    this.validateEmail();
    this.validateTel();
    return this.errors.every(e => e);
  }

  /**
   * Checks, if fieldiput exists.
   * @param desc - Description, what is requred.
   * @param field - Formvalue
   * @param errElem - Div for error message.
   * @returns - true, if input exists.
   */
  private checkRequired(desc:string, field:string, errElem:ElementRef<HTMLDivElement>):boolean {
    if (field.length == 0) {
      this.renderer.setProperty(errElem.nativeElement, 'innerText', `${desc} is required.`);
      return false;
    }
    this.renderer.setProperty(errElem.nativeElement, 'innerText', '');
    return true;
  }

  /**
   * Checks, if fieldinput is long enough.
   * @param desc - Decription, what needs length.
   * @param field - Formvalue.
   * @param min - Minimum of length.
   * @param errElem - Div for error message.
   * @returns - true, if minmum length is reached.
   */
  private checkMinLength(desc:string, field:string, min:number, errElem:ElementRef<HTMLDivElement>):boolean {
    if (field.length < min) {
      this.renderer.setProperty(errElem.nativeElement, 'innerText', `${desc} is too short.`);
      return false;
    }
    this.renderer.setProperty(errElem.nativeElement, 'innerText', '');
    return true;
  }

  /**
   * Checkes format.
   * @param desc - Description, which name is tested.
   * @param field - Formvalue.
   * @param patten - Regex-Pattern.
   * @param errElem - Div for error message
   * @returns - true, if name-format is correct.
   */
  private checkFormat(desc:string, field: string, pattern:RegExp, errElem:ElementRef<HTMLDivElement>): boolean {
    if (!field.match(pattern)) {
      this.renderer.setProperty(errElem.nativeElement, 'innerText', `${desc}-Format is not correct.`);
      return false;
    }
    this.renderer.setProperty(errElem.nativeElement, 'innerText', '');
    return true;
  }

  // #endregion Validation
}
