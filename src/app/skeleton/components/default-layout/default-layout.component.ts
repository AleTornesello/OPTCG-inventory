import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TopbarComponent} from '../topbar/topbar.component';
import {BottomNavbarComponent} from '../bottom-navbar/bottom-navbar.component';
import {TranslocoModule, TranslocoService} from '@jsverse/transloco';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {
  faArrowUpFromBracket,
  faChartSimple,
  faLayerGroup,
  faUserLock,
  faWrench
} from '@fortawesome/free-solid-svg-icons';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {ToastModule} from "primeng/toast";
import {OverlayLoaderComponent} from "../../../shared/components/overlay-loader/overlay-loader.component";
import {OptcgRoute} from "../../../app.routes";
import {UserRoles} from "../../../shared/models/authorization/user-roles";
import {UserRoleService} from "../../../shared/services/authorization/user-role.service";

export interface NavigationItem {
  label: string;
  route: string | string[];
  icon: IconDefinition;
  sidebarVisible: boolean;
  navbarVisible: boolean;
  roles?: UserRoles[];
}

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TopbarComponent,
    BottomNavbarComponent,
    SidebarComponent,
    TranslocoModule,
    ToastModule,
    OverlayLoaderComponent,
  ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss'
})
export class DefaultLayoutComponent {
  private _navigationItems: NavigationItem[];
  public sidebarVisible: boolean;

  constructor(
    private _translateService: TranslocoService,
    private _userRoleService: UserRoleService
  ) {
    this._navigationItems = [
      {
        label: this._translateService.translate('cards.cards'),
        route: `/${OptcgRoute.CARDS}`,
        icon: faLayerGroup,
        sidebarVisible: true,
        navbarVisible: true,
      },
      {
        label: this._translateService.translate('statistics.statistics'),
        route: `/${OptcgRoute.STATISTICS}`,
        icon: faChartSimple,
        sidebarVisible: true,
        navbarVisible: true,
      },
      {
        label: this._translateService.translate('sell.sell'),
        route: `/${OptcgRoute.SELLABLE_CARDS}`,
        icon: faArrowUpFromBracket,
        sidebarVisible: true,
        navbarVisible: true,
      },
      {
        label: this._translateService.translate('cards.cardProperties'),
        route: `/${OptcgRoute.CARD_PROPERTIES}`,
        icon: faUserLock,
        sidebarVisible: true,
        navbarVisible: false,
        roles: [UserRoles.ADMIN]
      },
      {
        label: this._translateService.translate('settings.settings'),
        route: `/${OptcgRoute.SETTINGS}`,
        icon: faWrench,
        sidebarVisible: true,
        navbarVisible: true,
      },
    ];
    this.sidebarVisible = false;
  }

  public onToggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  public onSidebarVisibleChange(visible: boolean) {
    this.sidebarVisible = visible;
  }

  public get navigationItems(): NavigationItem[] {
    if(!this._userRoleService.currentUserRole) {
      return this._navigationItems.filter((item) => !item.roles);
    }
    return this._navigationItems.filter((item) => !item.roles || item.roles.includes(this._userRoleService.currentUserRole));
  }
}
