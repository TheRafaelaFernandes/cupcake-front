import {AbstractControl, ValidationErrors, Validators} from "@angular/forms";

function isEmptyInputValue(value: any): boolean {
    return value == null || value.length === 0;
}

export class CustomValidators extends Validators {

    public static required(control: AbstractControl): ValidationErrors | null {
        try {
            return isEmptyInputValue(control.value) || !control.value.toString().match(/^(?!\s*$).+/g) ? {required: true} : null;
        } catch (e) {
            return isEmptyInputValue(control.value) ? {required: true} : null;
        }
    }

}
