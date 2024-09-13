import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {DialogModule} from "primeng/dialog";
import {CommonModule} from "@angular/common";
import {ButtonComponent} from "../../button/button.component";

export type DialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-simple-dialog',
  templateUrl: './simple-dialog.component.html',
  styleUrls: ['./simple-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonComponent],
})
export class SimpleDialogComponent {
  @Input() header: string;
  @Input() headerStyle: string;
  @Input() styleClass: string | undefined;
  @Input() closable: boolean;
  @Input() hideCloseButton: boolean;
  @Input() size: DialogSize;

  @Output() closed :EventEmitter<void>;

  public faTimes: IconDefinition;
  public visible: boolean;

  constructor() {
    this.visible = false;
    this.header = '';
    this.faTimes = faTimes;
    this.headerStyle = 'text-center';
    this.closable = true;
    this.hideCloseButton = false;
    this.size = 'md';

    this.closed = new EventEmitter();
  }

  public show() {
    this.visible = true;
  }

  public close() {
    this.visible = false;
    this.closed.emit();
  }

  public get dialogStyleClass(): string {
    const sizeStyle = `w-${this.size}`;
    return `${this.styleClass ?? ''} ${sizeStyle}`;
  }
}
