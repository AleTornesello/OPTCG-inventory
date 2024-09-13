import {ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {CommonModule} from "@angular/common";
import {ButtonComponent} from "../../button/button.component";
import {DialogSize, SimpleDialogComponent} from "../simple-dialog/simple-dialog.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {faCheckCircle, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {TranslocoPipe, TranslocoService} from "@jsverse/transloco";

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonComponent, SimpleDialogComponent, FontAwesomeModule, TranslocoPipe],
})
export class ConfirmDeleteDialogComponent {
  @ViewChild('dialog') dialog!: SimpleDialogComponent;

  @Input() header: string;
  @Input() headerStyle: string;
  @Input() styleClass: string | undefined;
  @Input() closable: boolean;
  @Input() hideCloseButton: boolean;
  @Input() size: DialogSize;
  @Input()  message!: string;

  @Output() closed: EventEmitter<void>;
  @Output() delete: EventEmitter<void>;

  constructor(private _cdRef: ChangeDetectorRef, private _translocoService: TranslocoService) {
    this.header = this._translocoService.translate('common.warning');
    this.headerStyle = 'text-center';
    this.closable = true;
    this.hideCloseButton = false;
    this.size = 'md';

    this.closed = new EventEmitter();
    this.delete = new EventEmitter();
  }

  public show() {
    this.dialog.show();
    this._cdRef.detectChanges();
  }

  public close() {
    this.dialog.close();
    this.closed.emit();
  }

  public onDialogClosed() {
    this.closed.emit();
  }

  public onConfirmDeleteClick() {
    this.delete.emit();
  }
}
