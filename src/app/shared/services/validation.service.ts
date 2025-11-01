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
  registerForm(key: 'contact', form: FormGroup) {
    this.forms.set(key, form);
  }
  // #endregion
  // #endregion
}
