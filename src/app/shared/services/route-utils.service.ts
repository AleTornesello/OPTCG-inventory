import {Injectable} from '@angular/core';
import {ActivatedRoute, Router, UrlSerializer, UrlTree} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RouteUtilsService {

  constructor(private _urlSerializer: UrlSerializer, private _router: Router, private _route: ActivatedRoute) {
  }

  public isRouteActive(route: string | string[] | UrlTree): string {
    if (Array.isArray(route)) {
      route = `/${route.join('/')}`;
    } else if (route instanceof UrlTree) {
      route = this._urlSerializer.serialize(route);
    }

    if (this._router.url === route) {
      return 'active';
    }

    if(this._route.snapshot.url.length > 0 && this._route.snapshot.url[0].path === route) {
      return 'active';
    }

    if(this._route.snapshot.url.length === 0 && route === '/') {
      return 'active';
    }

    return '';
  }
}
