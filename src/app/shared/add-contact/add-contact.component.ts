import { Component, inject, input, InputSignal, OnInit, output, OutputEmitterRef } from '@angular/core';
import { Contact } from '../classes/contact';
import { FireContactService } from '../services/fire-contact.service';
import { FormsModule } from '@angular/forms';
import { ToastMsgService } from '../services/toast-msg.service';
import { asyncScheduler, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { subscribe } from 'firebase/data-connect';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent implements OnInit{

  kindOf: InputSignal<string> = input.required<string>();
  contact$: InputSignal<Observable<Contact>> = input.required<Observable<Contact>>();

  closeOutput: OutputEmitterRef<void> = output<void>();
  
  isVisible: boolean = false;

  kindOfButtonTxt: string = 'Add';
  kindOfHeadlineTxt: string = 'Create contact ✓';

  private fireContactService: FireContactService = inject(FireContactService);
  private toastMsgService: ToastMsgService = inject(ToastMsgService);

  ngOnInit(): void {
    this.setTextForAddOrEdit();
  }

  async addContact() { 
    const data = this.contact$();
    await data.forEach(async (contactData) => {
      if(contactData == null || contactData.firstname == '' || contactData.lastname == '' || contactData.email == '' || contactData.tel == '') {
        this.toastMsgService.add('Create was failed by missing information', 3000, 'error');
        return;
      } else {
        if(this.kindOf().valueOf() == 'edit') {
          this.updateContact();
        } else {
          const result = await this.fireContactService.addContact(contactData);  
          if(result !== null) {
            this.isVisible = false;
            this.closeModal();
            this.toastMsgService.add('Contact created', 3000, 'success');
          }  else {
            this.toastMsgService.add('Contact could not created', 3000, 'error');
          }
        }
      }
    });
  }

  async updateContact() {
    const contactData = this.contact$();
    await contactData.forEach(async (contactData) => {
      if(contactData == null) {
        this.toastMsgService.add('Create was failed by missing information', 3000, 'error');
        return;
      } else {
        const result = await this.fireContactService.updateContact(contactData);
        if(result == null) {
          this.toastMsgService.add('Contact could not updated', 3000, 'error');   
        } else {
          this.toastMsgService.add('Contact created', 3000, 'success');
        }
      }
    });
  }

  setTextForAddOrEdit() {
    let kind: string = this.kindOf().valueOf();
    this.kindOfHeadlineTxt = kind == 'add' ? 'Add' : 'Edit';
    this.kindOfButtonTxt = kind == 'add' ? 'Create contact ✓' : 'Save';
  }

  closeModal () {
    this.closeOutput.emit();
    
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
