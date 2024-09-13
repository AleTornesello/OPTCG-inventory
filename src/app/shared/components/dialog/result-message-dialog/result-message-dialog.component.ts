import {ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {CommonModule} from "@angular/common";
import {ButtonComponent} from "../../button/button.component";
import {DialogSize, SimpleDialogComponent} from "../simple-dialog/simple-dialog.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {faCheckCircle, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {TranslocoPipe} from "@jsverse/transloco";

type Status = 'success' | 'error';

@Component({
  selector: 'app-result-message-dialog',
  templateUrl: './result-message-dialog.component.html',
  styleUrls: ['./result-message-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonComponent, SimpleDialogComponent, FontAwesomeModule, TranslocoPipe],
})
export class ResultMessageDialogComponent {
  @ViewChild('dialog') dialog!: SimpleDialogComponent;

  @Input() header: string;
  @Input() headerStyle: string;
  @Input() styleClass: string | undefined;
  @Input() closable: boolean;
  @Input() hideCloseButton: boolean;
  @Input() size: DialogSize;

  @Output() closed: EventEmitter<void>;

  private _status!: Status;
  private _message!: string;

  constructor(private _cdRef: ChangeDetectorRef) {
    this.header = '';
    this.headerStyle = 'text-center';
    this.closable = true;
    this.hideCloseButton = false;
    this.size = 'md';

    this.closed = new EventEmitter();
  }

  public show(status: Status, message: string) {
    this._message = message;
    this._status = status;
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

  public get status(): Status {
    return this._status;
  }

  public get message(): string {
    return this._message;
  }

  public get icon(): IconDefinition {
    if (this.status === 'success') {
      return faCheckCircle;
    }
    return faTimesCircle;
  }

  public get iconClasses(): string {
    let classes = "";
    if (this._status) {
      classes = `status-${this._status}`;
    }
    return classes;
  }
}
