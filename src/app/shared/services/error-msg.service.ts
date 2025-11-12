import { Injectable, signal } from '@angular/core';
import { ValidationFields } from '../enums/validation-fields';

@Injectable({
  providedIn: 'root'
})
export class ErrorMsgService {

  // #region attributes

  // contact fields
  firstnameErrorMsg = signal<string>('');
  lastnameErrorMsg = signal<string>('');
  emailErrorMsg = signal<string>('');
  phoneErrorMsg = signal<string>('');

  // task fields
  titleErrorMsg = signal<string>('');
  descriptionErrorMsg = signal<string>('');
  dueDateErrorMsg = signal<string>('');

  // subtask fields
  subtaskErrorMsg = signal<string>('');

  // sign up fields

  // login fields

  // #endregion attributes
  
  constructor() { }

  // #region methods

  setErrorMsg(field: ValidationFields, msg: string) {
    switch(field) {
      case ValidationFields.FIRSTNAME:
        this.firstnameErrorMsg.set(msg);
        break;
      case ValidationFields.LASTNAME:
        this.lastnameErrorMsg.set(msg);
        break;
      case ValidationFields.EMAIL:
        this.emailErrorMsg.set(msg);
        break;
      case ValidationFields.PHONE:
        this.phoneErrorMsg.set(msg);
        break;
      case ValidationFields.TITLE:
        this.titleErrorMsg.set(msg);
        break;
      case ValidationFields.DESCRIPTION:
        this.descriptionErrorMsg.set(msg);
        break;
      case ValidationFields.DUEDATE:
        this.dueDateErrorMsg.set(msg);
        break;
      case ValidationFields.SUBTASK:
        this.subtaskErrorMsg.set(msg);
        break;
      default:
        break;
    }
  }

  // #endregion methods
}
