import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';
import {AbstractControl, ValidationErrors} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faCircleExclamation} from '@fortawesome/free-solid-svg-icons';
import {FormControlValidationService} from "../../../services/form-control-validation.service";

@Component({
  selector: 'app-input-error-label',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './input-error-label.component.html',
  styleUrl: './input-error-label.component.scss',
})
export class InputErrorLabelComponent {
  @Input({ required: true }) label!: string;
  @Input() reserveSpace: boolean;

  @Input() control?: AbstractControl<any, any>;

  @Input() set errors(errors: ValidationErrors | null) {
    this._errors = errors;
  }

  protected readonly faCircleExclamation = faCircleExclamation;

  private _errors: ValidationErrors | null;

  constructor(
    private _formControlValidationService: FormControlValidationService
  ) {
    this._errors = null;
    this.reserveSpace = true;
  }

  public get isOnError(): boolean {
    const errors = this.errors;
    return errors != null && Object.keys(errors).length > 0;
  }

  public get errors(): ValidationErrors | null {
    if (this.control) {
      if (this.control.touched) {
        return this.control.errors;
      }
      return null;
    }
    return this._errors;
  }

  public get errorMessage() {
    if (this.isOnError && this.label) {
      const errorKey = Object.keys(this.errors!)[0];

      return this._formControlValidationService.getErrorMessage(
        errorKey,
        this.label,
        this.errors![errorKey]
      );
    }

    return '';
  }
}
