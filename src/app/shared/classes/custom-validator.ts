import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CustomValidator {
    /** 
     * Validator for required fields.
     * Whitspace only is not allowed.
     */
    static strictRequired(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value || typeof value == 'string' && value.trim().length == 0) return {strictRequired: true};
            return null;
        }
    }

    /**
     * Validates a tel number.
     * Format: 0<prefix> <phone number>
     * @returns - ValidationError or null.
     */
    static tel(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            const regex: RegExp = /^0\d+ \d+$/;
            if (typeof value != 'string' || !regex.test(value)) return {tel: true}
            return null;
        }
    }

    /**
     * Validates a name, which begins Uppercase
     * @returns - ValidationError or null.
     */
    static firstUpperCase(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (typeof value == 'string') {
                const words: string[] = value.split(/[ -]/);
                const regex: RegExp = /^[A-ZÄÖÜ][a-zäöüß]+$/;
                if (!words.every(word => regex.test(word))) return {firstUpperCase: true};
            }
            return null;
        }
    }
}
