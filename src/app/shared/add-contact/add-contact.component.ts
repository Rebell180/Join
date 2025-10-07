import { Component, ElementRef, inject, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { Contact } from '../classes/contact';
import { FireContactService } from '../services/fire-contact.service';
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
export class AddContactComponent implements OnInit{

  // private fcs: FireContactService = inject(FireContactService);
  // private tms: ToastMsgService = inject(ToastMsgService);
  cs: ContactService = inject(ContactService);
  defaultContact: Observable<Contact> = this.cs.contactToEdit;
  private renderer: Renderer2 = inject(Renderer2);
  
  errors: boolean[] = [false, false, false, false];
  @ViewChildren('errEl') errorRefs!: QueryList<ElementRef<HTMLDivElement>>;
  

  ngOnInit(): void {

  }

  async addContact() { 

    // contactData.firstname = this.getInputElementValue('firstname');
    // contactData.lastname = this.getInputElementValue('lastname');
    // contactData.email = this.getInputElementValue('email');
    // contactData.tel = this.getInputElementValue('tel');
    // contactData.group = contactData.firstname[0] ? contactData.firstname[0].toUpperCase() : '';

    // if (!contactData || !contactData.firstname || !contactData.lastname || !contactData.email || !contactData.tel) {
    //   this.tms.add('Create was failed by missing information', 3000, 'error');
    //   return;
    // }

    // let result = null;
    // if (this.cs.isAddModalOpen) {
    //   result = await this.fcs.addContact(contactData);
    //   if(result !== null) {
    //     result = await this.fcs.updateContact(contactData);
    //     if(result !== null) {
    //       this.tms.add('Contact created', 3000, 'success');
    //       this.isVisible = false;
    //       this.closeModal();
    //     } else {
    //       this.tms.add('Sorry, something went wrong', 3000, 'error');
    //     }
    //   }
    // } else if (this.cs.isEditModalOpen) {
    //   result = await this.fcs.updateContact(contactData);
    //   if(result !== null) {
    //       this.tms.add('Contact created', 3000, 'success');
    //       this.isVisible = false;
    //       this.closeModal();
    //     } else {
    //       this.tms.add('Sorry, something went wrong', 3000, 'error');
    //     }
    // }
  }

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
    // e.preventDefault();
    const a = this.validateAll();
    console.log('validate success: ' + a);
    if (a) {
      console.log('reach 1');
      this.cs.contactToEdit.forEach(async (contact) => {
        console.log('reach 2');
        console.log(contact);
        if(contact.id == '') {
          console.log('reach 3');
          await this.cs.addContactToDB(contact);
        } else {
          console.log('reach 4');
          await this.cs.updateContactInDB(contact);
        }

        // const data = this.contact$();
        //   await data.forEach( async contactData => {
        //   if (contactData) {
        //     contact.id = contactData.id;
        //     contact.iconColor = contactData.iconColor;
        //   } 
        //   contactData = contact;
        // });
      });
      console.log('reach end');
      // TODO: ContactService add/edit.
      this.closeModal();
      console.log('reach closed');
    }
  }
  
  // #region validation 
  /** Validates firstname. */
  protected validateFirstName(): void {
    const contactInForm: Observable<Contact> = this.cs.contactToEdit;
    let valueToValidate: string = '';
    contactInForm.forEach((contact: Contact) => {
      valueToValidate = contact.firstname;
      console.log('validate firstname: ' + valueToValidate);
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
      console.log('validate lastname: ' + valueToValidate);
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
      console.log('validate email: ' + valueToValidate);
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
      console.log('validate tel: ' + valueToValidate);
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

  // TODO 
  // #region validation

  // verifyData(): boolean {
  //   if(
  //     this.validateFirstname() &&
  //     this.validateLastname() && 
  //     this.validateEmail() && 
  //     this.validateTel()
  //   ) {
  //     return true;
  //   } else {
  //     return false;
  //   }  
  // }

  // private validateFirstname(): boolean {
  //   if(this.contact().firstname != '' && this.contact().firstname.length >= 3){
  //     return true;
  //   }
  //   return false;
  // }

  // private validateLastname(): boolean {
  //   if(this.contact().lastname != '' && this.contact().lastname.length >= 3){
  //     return true;
  //   }
  //   return false;
  // }

  // private validateEmail(): boolean {
  //   if(this.contact().email != '' && this.contact().email.match(new RegExp(`/^\S+@\S+\.\S+$/`))) {
  //     return true;
  //   }
  //   return false;
  // }

  // private validateTel(): boolean {
  //   if(this.contact().tel != '' && this.contact().tel.length >= 7 && this.contact().tel.match(new RegExp('^[0-9]'))){
  //     return true;
  //   }
  //   return false;
  // }

  // #endregion validation
}
