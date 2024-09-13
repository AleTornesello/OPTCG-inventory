import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {CamelToKebabPipe} from "../../../pipes/camel-to-kebab.pipe";
import {InputErrorLabelComponent} from "../input-error-label/input-error-label.component";

@Component({
  selector: 'app-input-wrapper',
  standalone: true,
  imports: [CommonModule, InputErrorLabelComponent, CamelToKebabPipe],
  templateUrl: './input-wrapper.component.html',
  styleUrl: './input-wrapper.component.scss',
})
export class InputWrapperComponent {
  @Input() label: string | undefined;
  @Input() for: string | undefined;
  @Input() required: boolean;
  @Input() errors: ValidationErrors | null;
  @Input() hideLabel: boolean;

  constructor() {
    this.required = false;
    this.errors = null;
    this.hideLabel = false;
  }
}
