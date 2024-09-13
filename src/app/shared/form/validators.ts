import {AbstractControl, ValidatorFn} from "@angular/forms";

export class MsjFormValidators {
  static minLength(minLength: number): ValidatorFn {
    return (control) => {
      if (control.value && control.value.length < minLength) {
        return {minLength: {requiredLength: minLength, actualLength: control.value.length}};
      }
      return null;
    };
  }

  static samePassword(otherControl: AbstractControl): ValidatorFn {
    return (control) => {
      if (control.value !== otherControl.value) {
        return {passwordsAreNotEquals: true};
      }
      return null;
    };
  }
}
