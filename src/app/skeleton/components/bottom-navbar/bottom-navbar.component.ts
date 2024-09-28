import {Component, Input} from '@angular/core';
import {NavigationItem} from '../default-layout/default-layout.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {RouteUtilsService} from "../../../shared/services/route-utils.service";

@Component({
  selector: 'app-bottom-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './bottom-navbar.component.html',
  styleUrl: './bottom-navbar.component.scss',
})
export class BottomNavbarComponent {
  get items(): NavigationItem[] {
    return this._items;
  }
  @Input({required: true}) set items(items: NavigationItem[]) {
    this._items = items.filter((item) => item.navbarVisible);
  }

  private _items: NavigationItem[];

  constructor(private _routeUtilsService: RouteUtilsService) {
    this._items = [];
  }

  public isRouteActive(route: string | string[]): string {
    return this._routeUtilsService.isRouteActive(route);
  }
}
