import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { InputSwitchChangeEvent, InputSwitchModule } from 'primeng/inputswitch';
import { InputWrapperComponent } from '../input-wrapper/input-wrapper.component';
import { CamelToKebabPipe } from '../../../pipes/camel-to-kebab.pipe';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    CommonModule,
    InputWrapperComponent,
    InputSwitchModule,
    FormsModule,
    CamelToKebabPipe,
  ],
})
export class SwitchComponent implements ControlValueAccessor {
  @Input({ required: true }) label!: string;
  @Input() for: string | undefined;
  @Input() required: boolean;
  @Input({ required: true }) falseLabel!: string;
  @Input({ required: true }) trueLabel!: string;
  @Input() textMode: boolean;
  @Input() styleClass: string | undefined;

  public value!: boolean;

  @Output() onChangeValue: EventEmitter<boolean>;

  constructor() {
    this.required = false;
    this.textMode = false;
    this.onChangeValue = new EventEmitter();
  }
  public onChange: any = () => {};
  public onTouched: any = () => {};

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

  public onSwitchChange(event: InputSwitchChangeEvent) {
    this.onChange(event.checked);
    this.onTouched();
    this.onChangeValue.emit(event.checked);
  }
}
