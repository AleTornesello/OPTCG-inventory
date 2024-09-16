import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {Button} from 'primeng/button';

type ButtonStyle = 'text';
type ButtonColor = 'success' | 'info' | 'warning' | 'danger' | 'primary' | 'secondary';
type ButtonSize = 'small' | 'large';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [Button, CommonModule, FontAwesomeModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {

  @Input() label: string;
  @Input() type: string;
  @Input() icon?: IconDefinition;
  @Input() disabled: boolean;
  @Input() expand: boolean;
  @Input() buttonStyle?: ButtonStyle | ButtonStyle[];
  @Input() color?: ButtonColor;
  @Input() size?: ButtonSize;

  @Output() onClick: EventEmitter<MouseEvent>;

  constructor() {
    this.type = 'button';
    this.label = '';
    this.disabled = false;
    this.expand = true;

    this.onClick = new EventEmitter();
  }

  public onButtonClick(event: MouseEvent) {
    this.onClick.emit(event);
  }

  public get isTextButton(): boolean {
    if (Array.isArray(this.buttonStyle)) {
      return this.buttonStyle.includes('text');
    }
    return this.buttonStyle === 'text';
  }

  public get isIconButton(): boolean {
    return this.icon !== undefined && (this.label === undefined || this.label === null || this.label === '');
  }
}
