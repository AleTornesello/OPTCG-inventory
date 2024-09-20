import {CommonModule} from '@angular/common';
import {Component, EventEmitter, forwardRef, Input, Output,} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ValidationErrors,} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {ButtonModule} from 'primeng/button';
import {InputWrapperComponent} from '../input-wrapper/input-wrapper.component';
import {AvoidEmptyValuePipe} from "../../../pipes/avoid-empty-value.pipe";
import {CamelToKebabPipe} from "../../../pipes/camel-to-kebab.pipe";
import {ButtonComponent} from "../../button/button.component";
import {SliderChangeEvent, SliderModule} from "primeng/slider";

@Component({
  selector: 'app-input-slider',
  standalone: true,
  imports: [
    CommonModule,
    InputWrapperComponent,
    AvoidEmptyValuePipe,
    CamelToKebabPipe,
    ButtonModule,
    FontAwesomeModule,
    FormsModule,
    ButtonComponent,
    SliderModule,
  ],
  templateUrl: './input-slider.component.html',
  styleUrl: './input-slider.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSliderComponent),
      multi: true,
    },
  ],
})
export class InputSliderComponent implements ControlValueAccessor {

  @Input() label: string | undefined;
  @Input() for: string | undefined;
  @Input() required: boolean;
  @Input() readonly: boolean;
  @Input() range: boolean;
  @Input() showRange: boolean;
  @Input() value!: number | number[];

  @Input() set errors(errors: ValidationErrors | null) {
    this._errors = errors;
  }

  @Input() control: AbstractControl<any, any> | undefined;
  @Input() max: number | null;
  @Input() min: number | null;
  @Input() step: number;

  @Input() textMode: boolean;
  @Input() inputClass: { [klass: string]: any } | undefined;

  @Output() onChangeValue: EventEmitter<number | number[]>;
  @Output() onSlideEnd: EventEmitter<void>;

  protected readonly faTimes: IconDefinition;

  public isDisabled: boolean;
  public onChange: any = () => {
  };
  public onTouched: any = () => {
  };
  private _errors: ValidationErrors | null;

  constructor() {
    this._errors = null;
    this.faTimes = faTimes;
    this.onChangeValue = new EventEmitter();
    this.onSlideEnd = new EventEmitter();
    this.isDisabled = false;
    this.max = null;
    this.min = null;
    this.step = 1;
    this.textMode = false;
    this.required = false;
    this.readonly = false;
    this.range = false;
    this.showRange = false;
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

  public onModelChange(event: SliderChangeEvent) {
    if (this.range) {
      this.value = event.values!;
      this.onChange(event.values!);
      this.onChangeValue.emit(event.values!);
      return;
    }
    this.value = event.value!;
    this.onChange(event.value!);
    this.onChangeValue.emit(event.value!);
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

  public onSlideEndEvent() {
    this.onSlideEnd.emit();
  }

  public getLeftExtremum() {
    return (this.value as number[])[0];
  }

  public getRightExtremum() {
    return (this.value as number[])[1];
  }
}
