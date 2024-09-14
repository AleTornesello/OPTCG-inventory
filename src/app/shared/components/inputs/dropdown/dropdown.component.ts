import {
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor, FormsModule,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import {DropdownChangeEvent, DropdownModule} from 'primeng/dropdown';
import {InputWrapperComponent} from "../input-wrapper/input-wrapper.component";
import {AvoidEmptyValuePipe} from "../../../pipes/avoid-empty-value.pipe";
import {InputTextModule} from "primeng/inputtext";
import {CamelToKebabPipe} from "../../../pipes/camel-to-kebab.pipe";
import {NgClass, NgTemplateOutlet} from "@angular/common";
import {DropdownItemDirective, DropdownItemTemplateContext} from "../../../directives/dropdown-item.directive";
import {MultiSelectModule} from "primeng/multiselect";

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    InputWrapperComponent,
    AvoidEmptyValuePipe,
    InputTextModule,
    CamelToKebabPipe,
    DropdownModule,
    FormsModule,
    NgTemplateOutlet,
    NgClass,
    MultiSelectModule
  ],
})
export class DropdownComponent implements ControlValueAccessor {
  @ContentChildren(DropdownItemDirective)
  private _dropdownItemDirectives: QueryList<DropdownItemDirective> | undefined;

  @Input() label: string | undefined;
  @Input({ required: true }) options!: any[];
  @Input() filter: boolean;
  @Input() filterBy: string | undefined;
  @Input() showClear: boolean;
  @Input() placeholder: string | undefined;
  @Input() for: string | undefined;
  @Input() required: boolean;
  @Input() readonly: boolean;
  @Input() optionLabel: string = 'label';
  @Input() optionValue: string = 'value';
  @Input() multipleSelect: boolean;
  @Input() set errors(errors: ValidationErrors | null) {
    this._errors = errors;
  }
  @Input() control: AbstractControl<any, any> | undefined;
  @Input() textMode: boolean;
  @Input() value!: any;
  @Input() styleClass: string;

  @Output() onChangeValue: EventEmitter<any>;
  public onChange: any = () => {};
  public onTouched: any = () => {};
  public isDisabled: boolean;

  private _errors: ValidationErrors | null;

  constructor() {
    this.filter = false;
    this.filterBy = undefined;
    this.showClear = false;
    this.required = false;
    this.readonly = false;
    this._errors = null;
    this.onChangeValue = new EventEmitter();
    this.isDisabled = false;
    this.textMode = false;
    this.styleClass = '';
    this.multipleSelect = false;
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

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  public onInputChange(event: DropdownChangeEvent) {
    this.onChange(event.value);
    if (this.control && this.control.pristine) {
      return;
    }
    this.onChangeValue.emit(event.value);
  }
  public get readonlyLabel(): string {
    return (
      this.options.find((option) => option.value === this.value)?.label ??
      this.value
    );
  }

  public get isOnError(): boolean {
    const errors = this.errors;
    return errors !== null && Object.keys(errors).length > 0;
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

  public getLabelFromValue(value: any): string | undefined {
    return this.options.find((option) => option.value === value)?.label;
  }

  public getDropdownItemTemplate():
    | TemplateRef<DropdownItemTemplateContext>
    | undefined {
    return this._dropdownItemDirectives?.first?.template;
  }
}
