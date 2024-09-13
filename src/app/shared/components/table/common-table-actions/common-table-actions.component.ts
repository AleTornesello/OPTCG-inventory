import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  faEllipsisV,
  faPen,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import {
  MenuItem,
  MenuPanelComponent,
} from '../../panel/menu-panel/menu-panel.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {ButtonComponent} from "../../button/button.component";

@Component({
  selector: 'app-common-table-actions',
  templateUrl: './common-table-actions.component.html',
  styleUrls: ['./common-table-actions.component.scss'],
  standalone: true,
  imports: [MenuPanelComponent, ButtonModule, CommonModule, FontAwesomeModule, ButtonComponent],
})
export class CommonTableActionsComponent implements OnInit {
  @ViewChild('menu') menu!: MenuPanelComponent;

  @Input() hideEdit: boolean;
  @Input() hideDelete: boolean;
  @Input() row: any;

  @Input() set actions(actions: MenuItem[]) {
    this._actions = actions;
    this.initMenuItems();
  }

  @Output() edit: EventEmitter<void>;
  @Output() delete: EventEmitter<void>;

  public menuItems: MenuItem[];
  public _actions: MenuItem[];

  protected readonly faEllipsisV = faEllipsisV;

  constructor(private _translateService: TranslocoService) {
    this.hideEdit = false;
    this.hideDelete = false;
    this.edit = new EventEmitter();
    this.delete = new EventEmitter();
    this.menuItems = [];
    this._actions = [];
  }

  public ngOnInit() {
    this.initMenuItems();
  }

  public initMenuItems() {
    this.menuItems = [];

    if (!this.hideEdit) {
      this.menuItems.push({
        id: 'edit',
        label: this._translateService.translate('common.table.actions.edit'),
        icon: faPen,
        color: 'blue',
        command: () => this.onEdit(),
      });
    }

    if (this._actions) {
      this.menuItems.push(
        ...this._actions.map((item) => ({
          ...item,
          command: () => this._onClick(item),
        }))
      );
    }
    if (!this.hideDelete) {
      this.menuItems.push({
        id: 'delete',
        label: this._translateService.translate('common.table.actions.delete'),
        icon: faTrashAlt,
        color: 'red',
        command: () => this.onDelete(),
      });
    }
  }

  public onEdit() {
    this.edit.emit();
  }

  public onDelete() {
    this.delete.emit();
  }

  private _onClick(item: MenuItem) {
    if (item.command) {
      item.command(this.row);
    }
  }

  public onToggleMenuButtonClick(event: MouseEvent) {
    this.menu.toggle(event);
  }
}
