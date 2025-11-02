import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  forms: Map<string, FormGroup> = new Map<string, FormGroup>();

  // #region Methods
  // #region Form-Mangement
  /**
   * Adds a new from for registry.
   * @param key - Key of form.
   * @param form - FromGroup, which is added.
   */
  registerForm(key: 'contact', form: FormGroup): void {
    this.forms.set(key, form);
  }

  /**
   * Removes a form from registry.
   * Use it on ngOnDestroy in component.
   * @param key - Key for delete
   */
  removeForm(key: string): void {
    this.forms.delete(key);
  }
  // #endregion
  
  /**
   * Validates a form.
   * @param formType - Type of Form ('contact')
   * @returns Record of errors
   */
  validateForm(formType: 'contact'): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    const form: FormGroup | undefined = this.forms.get(formType);

    if (form) {
      Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        if (control && control.errors) {
          errors[key] = [];
          for (const errorKey in control.errors) {
            errors[key].push(this.getErrorMessage(errorKey, control.errors[errorKey]))
          }
        }
      });
    }

    return errors
  }
  /**
   * Gets an error message for user.
   * @param errorKey - Key in Error-Record
   * @param errorValue - Value of Validation (example maxLength(value))
   * @returns - Errormessage for user.
   */
  private getErrorMessage(errorKey: string, errorValue?:any): string {
    switch (errorKey) {
      case 'strictRequired':
        return 'Field is required.';

      case 'minlength':
        return `Minimal ${errorValue.requiredLength} sign required.`;

      case 'email':
        return 'E-Mail format is not correct.';

      case 'tel':
        return 'Use format: 0<prefix phone number> <phone number>';

      case 'pattern':
        return 'Format is not correct.'
    }
    return 'Value is invalid.';
  }
  // #endregion
}