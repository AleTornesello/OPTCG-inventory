import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ValidationErrors,} from '@angular/forms';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {InputWrapperComponent} from "../input-wrapper/input-wrapper.component";
import {NgClass} from "@angular/common";
import {AvoidEmptyValuePipe} from "../../../pipes/avoid-empty-value.pipe";
import {InputNumberModule} from "primeng/inputnumber";
import {TooltipModule} from "primeng/tooltip";
import {InputTextModule} from "primeng/inputtext";
import {CamelToKebabPipe} from "../../../pipes/camel-to-kebab.pipe";
import {Button} from "primeng/button";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    InputWrapperComponent,
    NgClass,
    AvoidEmptyValuePipe,
    InputNumberModule,
    TooltipModule,
    InputTextModule,
    FormsModule,
    CamelToKebabPipe,
    Button,
    FaIconComponent
  ],
})
export class InputNumberComponent implements ControlValueAccessor, OnInit {
  @Input() label: string | undefined;
  @Input() for: string | undefined;
  @Input() autocomplete: string | undefined;
  @Input() required: boolean;
  @Input() placeholder: string | undefined;
  @Input() readonly: boolean;
  @Input() useGrouping: boolean;
  @Input() mode: 'decimal' | 'currency' | undefined;

  @Input() set errors(errors: ValidationErrors | null) {
    this._errors = errors;
  }

  @Input() control: AbstractControl<any, any> | undefined;
  @Input() max: number | undefined;
  @Input() min: number | undefined;

  @Input() clear: boolean;
  @Input() tooltip: string = '';
  @Input() tooltipPosition: string = 'top';
  @Input() textMode: boolean;
  @Input() suffix?: string;

  @Input() value: number | null;

  @Input() lazyDebounceTime: number;
  @Input() lazy: boolean;

  @Output() onClear: EventEmitter<void>;
  @Output() onChangeValue: EventEmitter<number | null>;

  public faTimes: IconDefinition;

  public isDisabled: boolean;
  public onChange: any = () => {
  };
  public onTouched: any = () => {
  };
  private _errors: ValidationErrors | null;
  private _searchUpdate: Subject<number>;

  constructor(
    private _destroyRef: DestroyRef
  ) {
    this.placeholder = '';
    this._errors = null;
    this.clear = false;
    this.faTimes = faTimes;
    this.onClear = new EventEmitter();
    this.onChangeValue = new EventEmitter();
    this.isDisabled = false;
    this.textMode = false;
    this.useGrouping = false;
    this.readonly = false;
    this.required = false;
    this.value = null;
    this.lazyDebounceTime = 400;
    this.lazy = false;
    this._searchUpdate = new Subject();
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
    this.value = event.value;
    this.onChange(event.value);

    if (this.lazy) {
      this._searchUpdate.next(event.target.value);
    } else {
      this.onChangeValue.emit(event.target.value);
    }
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
    this.value = null;
  }

  public get isDecimal(): boolean {
    return this.mode === 'decimal';
  }

  public get maxValue(): number {
    if (!this.max) {
      return 2147483647;
    }

    return Math.min(this.max, 2147483647);
  }

  public get minValue(): number {
    if (!this.min) {
      return -2147483648;
    }

    return Math.max(this.min, -2147483648);
  }

  public onBlur(event: any) {
    if (event.target.value === '') {
      this.value = null;
    } else {
      // Remove all non-numeric characters, e.g. dollar sign, euro sign, etc.
      this.value = parseInt(
        (event.target.value as string).replace(/[^0-9.,]+/gm, ''),
        10
      );
    }

    this.onChange(this.value);
    this.onChangeValue.emit(this.value);
  }
}
