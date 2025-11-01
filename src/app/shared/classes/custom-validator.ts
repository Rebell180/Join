import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CustomValidator {
    
    static strictRequired(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value || typeof value == 'string' && value.trim().length == 0) return {strictRequired: true}
            return null;
        }
    }
}
