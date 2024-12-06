import {CommonModule} from '@angular/common';
import {Component, DestroyRef, EventEmitter, forwardRef, Input, OnInit, Output,} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ValidationErrors,} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {InputWrapperComponent} from '../input-wrapper/input-wrapper.component';
import {AvoidEmptyValuePipe} from "../../../pipes/avoid-empty-value.pipe";
import {CamelToKebabPipe} from "../../../pipes/camel-to-kebab.pipe";
import {ButtonComponent} from "../../button/button.component";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [
    CommonModule,
    InputWrapperComponent,
    AvoidEmptyValuePipe,
    CamelToKebabPipe,
    ButtonModule,
    InputTextModule,
    FontAwesomeModule,
    FormsModule,
    ButtonComponent,
  ],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
  ],
})
export class InputTextComponent implements ControlValueAccessor, OnInit {
  @Input() value!: string;
  @Input() label: string | undefined;
  @Input() for: string | undefined;
  @Input() autocomplete: string | undefined;
  @Input() required: boolean;
  @Input() placeholder: string | undefined;
  @Input() type: string;
  @Input() readonly: boolean;

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
  @Input() lazyDebounceTime: number;
  @Input() lazy: boolean;

  @Output() onClear: EventEmitter<void>;
  @Output() onChangeValue: EventEmitter<string>;

  public faTimes: IconDefinition;

  public isDisabled: boolean;
  public onChange: any = () => {
  };
  public onTouched: any = () => {
  };
  private _errors: ValidationErrors | null;
  private _searchUpdate: Subject<string>;

  constructor(
    private _destroyRef: DestroyRef
  ) {
    this.type = 'text';
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
    this.readonly = false;
    this._searchUpdate = new Subject();
    this.lazyDebounceTime = 400;
    this.lazy = false;
  }

  public ngOnInit() {
    this._searchUpdate
      .pipe(
        debounceTime(this.lazyDebounceTime),
        distinctUntilChanged(),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe({
        next: (value) => {
          this.onChangeValue.emit(value);
        },
      });
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
    if (this.lazy) {
      this._searchUpdate.next(event.target.value);
    } else {
      this.onChangeValue.emit(event.target.value);
    }
  }

  public onModelChange(value: string) {
    this.value = value;
    // this.onChangeValue.emit(value);
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
    this.onChange(this.value);
    this.onChangeValue.emit(this.value);
  }

  public getInputClasses() {
    return {
      'ng-invalid ng-dirty': this.isOnError,
      'readonly-input': this.readonly,
      ...this.inputClass,
    };
  }
}
