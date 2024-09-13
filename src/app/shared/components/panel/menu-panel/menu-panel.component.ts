import {
  ChangeDetectorRef,
  Component,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export interface MenuItem {
  id?: string;
  label: string;
  icon?: string | IconDefinition;
  color?: 'red' | 'blue';
  command?: (data?: any) => void;
  visible?: boolean | ((data?: any) => boolean);
  disabled?: boolean | ((data?: any) => boolean);
}

@Component({
  selector: 'app-menu-panel',
  templateUrl: './menu-panel.component.html',
  styleUrls: ['./menu-panel.component.scss'],
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, OverlayPanelModule],
})
export class MenuPanelComponent {
  @ViewChild('op') op!: OverlayPanel;
  @ViewChild('primengIcon') primengIcon!: TemplateRef<any>;
  @ViewChild('faIcon') faIcon!: TemplateRef<any>;

  @Input({ required: true }) items: MenuItem[];
  @Input() context?: any;

  constructor(private cdref: ChangeDetectorRef) {
    this.items = [];
  }

  public isItemVisible(item: MenuItem) {
    if (item.visible === undefined) {
      return true;
    }

    if (typeof item.visible === 'boolean') {
      return item.visible;
    }

    return item.visible(this.context);
  }

  public isItemDisabled(item: MenuItem) {
    if (item.disabled === undefined) {
      return false;
    }

    if (typeof item.disabled === 'boolean') {
      return item.disabled;
    }

    return item.disabled(this.context);
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  public toggle(event: any) {
    this.op.toggle(event);
  }

  public getIconTemplate(
    icon?: string | IconDefinition
  ): TemplateRef<any> | null {
    if (!icon) {
      return null;
    }

    if (typeof icon === 'string') {
      return this.primengIcon;
    }

    return this.faIcon;
  }

  public onItemClick(item: MenuItem) {
    if (item.command) {
      item.command();
    }
  }
}
