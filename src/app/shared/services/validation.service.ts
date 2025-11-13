import { inject, Injectable, signal } from '@angular/core';
import { ValidationFields } from '../enums/validation-fields';
import { ErrorMsgService } from './error-msg.service';
import { Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  ems: ErrorMsgService = inject(ErrorMsgService);

  formValidContact = signal<boolean>(false);
  formValidTask = signal<boolean>(false);
  formValidSubtask = signal<boolean>(false);
  // TODO signup and login forms

  // #region Methods

  /**
   * Validate the submitted input value. 
   * Accept string and number values.
   * 
   * @param field @ValidationFields type of input field to validate.
   * @param value @string | @number value to validate.
   */
  validate(field: ValidationFields, value: string | number): void {
    let errorMsg: string = '';
    switch(field) {
      case ValidationFields.FIRSTNAME:
        errorMsg = this.validateFirstNameInput(value as string);
        break;
      case ValidationFields.LASTNAME:
        errorMsg = this.validateLastNameInput(value as string);
        break;
      case ValidationFields.EMAIL:
        errorMsg = this.validateEmailInput(value as string);
        break;
      case ValidationFields.PHONE:
        errorMsg = this.validatePhoneInput(value as string);
        break;
      case ValidationFields.TITLE:
        errorMsg = this.validateTitleInput(value as string);
        break;
      case ValidationFields.DESCRIPTION:
        errorMsg = this.validateDescriptionInput(value as string);
        break;
      case ValidationFields.DUEDATE:
        errorMsg = this.validateDueDateInput(value as number);
        break;
      case ValidationFields.SUBTASK:
        errorMsg = this.validateSubTaskInput(value as string);
        break;
      default:
        break;
    }
    this.ems.setErrorMsg(field, errorMsg);
    this.setFormValidation(field);
  }

  // #region input field methods

  // #region contact field validation methods
  /**
   * Validate the input of firstname text input.
   * 
   * @param value @string value to validate.
   * @returns @string error message of validation.
   */
  private validateFirstNameInput(value: string): string {
    let errorMsg: string = '';
    errorMsg = this.validateTextInput(value as string, {min: 2, max: 30});
    if(!errorMsg.length) {
      errorMsg = this.validateTextStyleInput(value as string);
      if(!errorMsg.length) {
        errorMsg = this.validateTextContentInput(value as string);
      }
    }
    return errorMsg;
  }

  /**
   * Validate the input of firstname text input.
   * 
   * @param value @string value to validate.
   * @returns @string error message of validation.
   */
  private validateLastNameInput(value: string): string {
    let errorMsg: string = '';
    errorMsg = this.validateTextInput(value as string, {min: 2, max: 30});
    if(!errorMsg.length) {
      errorMsg = this.validateTextStyleInput(value as string);
      if(!errorMsg.length) {
        errorMsg = this.validateTextContentInput(value as string);
      }
    }
    return errorMsg;
  }

  /**
   * Validate the input of email text input.
   * 
   * @param value @string value to validate.
   * @returns @string error message of validation.
   */
  private validateEmailInput(value: string): string {
    let errorMsg: string = '';
    errorMsg = this.validateTextInput(value, {min: 9, max: 30});
    if (errorMsg == '') {
      const regex: RegExp = /^\S+@\S+\.\S+$/;
      if (!regex.test(value)) {
        errorMsg = 'Wrong format. Allowed: "[abc]@[abc].[de, com ...]"';
      } 
    }
    return errorMsg;
  }

  /**
   * Validate the input of phonenumber text input.
   * 
   * @param value @string value to validate.
   * @returns @string error message of validation.
   */
  private validatePhoneInput(value: string): string {
    // '^[0-9]'
    let errorMsg: string = '';
    errorMsg = this.validateTextInput(value, {min: 8, max: 16});
    if (errorMsg == '') {
      const regex: RegExp = /^0\d+ \d+$/;
      if (!regex.test(value)) {
        errorMsg = 'Wrong format. Allowed: "+49 [012]", "0152 [012]"';
      } 
    }
    return errorMsg;
  }

  // #endregion contact field validation methods

  // #region task field validation methods

  /**
   * Validate the input of title text input.
   * 
   * @param value @string value to validate.
   * @returns @string error message of validation.
   */
  private validateTitleInput(value: string): string {
    let errorMsg: string = '';
    errorMsg = this.validateTextInput(value as string, {min: 3, max: 50});
    if(errorMsg.length) {
      errorMsg = this.validateTextStyleInput(value as string);
      if(!errorMsg.length) {
        errorMsg = this.validateTextContentInput(value as string);
      }
    }
    return errorMsg;
  }

  /**
   * Validate the input of description text input.
   * 
   * @param value @string value to validate.
   * @returns @string error message of validation.
   */
  private validateDescriptionInput(value: string): string {
    let errorMsg: string = '';
    this.validateTextInput(value as string);
      if(errorMsg.length) {
        errorMsg = this.validateTextStyleInput(value as string);
        if(!errorMsg.length) {
          errorMsg = this.validateTextContentInput(value as string);
        }
      }
    return errorMsg;
  }

  /**
   * Validate the input of due date text input.
   * 
   * @param value @number value to validate.
   * @returns @string error message of validation.
   */
  private validateDueDateInput(value: number): string {
    let errorMsg: string = '';
    errorMsg = this.validateDateSecondsInput(value);
    return errorMsg;
  }

  // #endregion task field validation methods


  // #region subtask field validation method

  /**
   * Validate the input of subtask text input.
   * 
   * @param value @string value to validate.
   * @returns @string error message of validation.
   */
  private validateSubTaskInput(value: string): string {
    let errorMsg: string = '';
    errorMsg = this.validateTextInput(value as string, {min: 2, max: 30});
    if(errorMsg.length) {
      errorMsg = this.validateTextStyleInput(value as string);
      if(!errorMsg.length) {
        errorMsg = this.validateTextContentInput(value as string);
      }
    }
    return errorMsg;
  }

  // #endregion subtask field validation method

  // #region sign up field validation method

  // #endregion sign up field validation method

  // #region login field validation method

  // #endregion login field validation method

  // #endregion input field methods

  // #region validation methods

  /**
   * Validate the content via RegEx. 
   * options:
   *      allowedRegEx: for valid value must match the reg ex.
   *  
   * @param value @string value to validate.
   * @param param1 @options object of optional validation parameter with default.
   * @returns 
   */
  private validateTextContentInput(value: string, {allowedRegEx = new RegExp('')} = {}): string {
    let valid: boolean = false;
    valid = allowedRegEx.test(value);
    if(valid) {
      return '';
    } else {
      return 'Wrong format of input.';
    }
  }

  /**
   * Validate with rules for upper case words.
   * options:
   *      firstLetterUpper: for valid only the first letter must be upper case.
   *      wordLetterUpper: for valid every word must start with upper case letter.
   *  
   * @param value @string value to validate.
   * @param param1 @options object of optional validation parameter with default.
   * @returns 
   */
  private validateTextStyleInput(value: string, {firstLetterUpper = false, wordLetterUpper = false} = {}): string {
    let errorMsg: string = '';
    if(wordLetterUpper) {
      const words: string[] = value.split(/[ -]/);
      const regex: RegExp = /^[A-ZÄÖÜ][a-zäöüß]+$/;
      if (words.every(word => regex.test(word))) {
        errorMsg = '';
      } else {
        errorMsg = 'Every word starts with upper case.';
      }
    } else if(firstLetterUpper) {
      if(value[0] === value[0].toUpperCase()){
        errorMsg = '';
      } else {
        errorMsg = 'First letter must be upper case.'; 
      }
    } else {
      return '';
    }
    return errorMsg;
  }

  /**
   * Validate the min and max length of value. 
   * options:
   *      min: minimum of value length.
   *      max: maximum of value length. 
   *  
   * @param value @string value to validate.
   * @param param1 @options object of optional validation parameter width default.
   * @returns @string errorMsg 
   */
  private validateTextInput(value: string, {min = 0, max = 500 } = {}): string {
    if(value.trim().length < min) {
      return 'Text is to short.';
    } else if(value.trim().length > max) {
      return 'Text is to long.';
    } else {
      return '';
    }
  }

  /**
   * Validate a date for seconds.
   * options:
   *      allowPast: if true allows past dates. 
   * 
   * @param value @string value to validate.
   * @param param1 @options object of optional validation parameter width default.
   * @returns @string errorMsg 
   */
  private validateDateSecondsInput(value: number, {allowPast = false} = {}): string {
    if(!allowPast) {
      const now = Timestamp.now().seconds;
      if(now > value) {
        return 'Date must be in the future.'
      } 
    }
    return '';
  }

  // #endregion validation methods

  // #region form validation

  /**
   * Set the form validation for form of submitted field.
   * Can be used for full form validation for example to enable submit-buttons.
   * 
   * @param field field to find group to validate.
   */
  private setFormValidation(field: ValidationFields) {
    switch(field) {
      case ValidationFields.FIRSTNAME || ValidationFields.LASTNAME || ValidationFields.EMAIL || ValidationFields.PHONE:
        this.validateContactForm();
        break;
      case ValidationFields.TITLE || ValidationFields.DESCRIPTION || ValidationFields.DUEDATE:
        this.validateTaskForm();
        break;
      case ValidationFields.SUBTASK:
        this.validateSubtaskForm();
        break;
      default: 
        break;
    }
  }

  /**
   * Check the current errorMsgs of contact form
   * to validate full form
   */
  private validateContactForm() {
    let errors: string = this.ems.firstnameErrorMsg() + this.ems.lastnameErrorMsg() + this.ems.emailErrorMsg() + this.ems.phoneErrorMsg();
    console.log(errors.length);
    this.formValidContact.set(!(errors.length > 0));
  }

  /**
   * Check the current errorMsgs of task form
   * to validate full form
   */
  private validateTaskForm() {
    let errors: string = this.ems.titleErrorMsg() + this.ems.descriptionErrorMsg() + this.ems.dueDateErrorMsg();
    this.formValidContact.set(!(errors.length > 0));
  }

  /**
   * Check the current errorMsgs of subtask form
   * to validate full form
   */
  private validateSubtaskForm() {
    let errors: string = this.ems.subtaskErrorMsg();
    this.formValidContact.set(!(errors.length > 0));
  }

  // #endregion form validation
  
  // #endregion
}