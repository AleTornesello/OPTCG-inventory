import {CommonModule} from '@angular/common';
import {Component, EventEmitter, forwardRef, Input, Output,} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ValidationErrors,} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {ButtonModule} from 'primeng/button';
import {InputWrapperComponent} from '../input-wrapper/input-wrapper.component';
import {PasswordModule} from 'primeng/password';
import {AvoidEmptyValuePipe} from "../../../pipes/avoid-empty-value.pipe";
import {CamelToKebabPipe} from "../../../pipes/camel-to-kebab.pipe";

@Component({
  selector: 'app-input-password',
  standalone: true,
  imports: [
    CommonModule,
    InputWrapperComponent,
    AvoidEmptyValuePipe,
    CamelToKebabPipe,
    ButtonModule,
    PasswordModule,
    FontAwesomeModule,
    FormsModule,
  ],
  templateUrl: './input-password.component.html',
  styleUrl: './input-password.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPasswordComponent),
      multi: true,
    },
  ],
})
export class InputPasswordComponent implements ControlValueAccessor {
  @Input({ required: true }) label!: string;
  @Input() for: string | undefined;
  @Input() required: boolean;
  @Input() placeholder: string | undefined;
  @Input() toggleMask: boolean;
  @Input() feedback: boolean;
  @Input() autocomplete: string;

  @Input() set errors(errors: ValidationErrors | null) {
    this._errors = errors;
  }

  @Input() control: AbstractControl<any, any> | undefined;
  @Input() maxLength: number | null;
  @Input() max: number | null;
  @Input() min: number | null;

  @Input() clear: boolean;
  @Input() textMode: boolean;
  @Input() inputClass: { [klass: string]: any } | undefined;
  @Input() showCounter: boolean;

  @Output() onClear: EventEmitter<void>;
  @Output() onChangeValue: EventEmitter<string>;

  public faTimes: IconDefinition;

  @Input() value!: string;
  public isDisabled: boolean;
  public onChange: any = () => {};
  public onTouched: any = () => {};
  private _errors: ValidationErrors | null;

  constructor() {
    this.placeholder = '';
    this._errors = null;
    this.clear = false;
    this.faTimes = faTimes;
    this.onClear = new EventEmitter();
    this.onChangeValue = new EventEmitter();
    this.isDisabled = false;
    this.maxLength = null;
    this.max = null;
    this.min = null;
    this.textMode = false;
    this.showCounter = false;
    this.required = false;
    this.toggleMask = true;
    this.feedback = false;
    this.autocomplete = '';
  }

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  public onInputChange(event: any) {
    this.onChange(event.target.value);
    this.onChangeValue.emit(event.target.value);
  }

  public onModelChange(value: string) {
    this.value = value;
    this.onChangeValue.emit(value);
  }

  public get isOnError(): boolean {
    const errors = this.errors;
    return errors != null && Object.keys(errors).length > 0;
  }

  public get errors() {
    if (this.control) {
      if (this.control.touched) {
        return this.control.errors;
      }
      return null;
    }
    return this._errors;
  }

  public clearValue() {
    this.onClear.emit();
    this.value = '';
  }

  public getInputClasses() {
    return {
      'ng-invalid ng-dirty': this.isOnError,
      ...this.inputClass,
    };
  }
}
