import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {CheckboxModule} from "primeng/checkbox";
import {InputWrapperComponent} from "../input-wrapper/input-wrapper.component";
import {CamelToKebabPipe} from "../../../pipes/camel-to-kebab.pipe";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    CheckboxModule,
    FormsModule,
    InputWrapperComponent,
    CamelToKebabPipe,
    NgClass
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() label!: string;
  @Input() inputId!: string;

  @Input() for: string | undefined;
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;
  @Input() center: boolean = false;
  @Input() value!: string;

  @Output() onChangeValue: EventEmitter<boolean>;

  public onChange: any = () => {};
  public onTouched: any = () => {};

  constructor() {
    this.onChangeValue = new EventEmitter();
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
    // Implement this method if you want to support disabling the custom form field control
  }

  public onInputChange(event: any) {
    this.onChange(event.checked);
    this.onTouched();
    this.onChangeValue.emit(event.checked);
  }
}
