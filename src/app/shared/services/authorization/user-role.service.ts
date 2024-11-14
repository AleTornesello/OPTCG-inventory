import { Injectable } from '@angular/core';
import {UserRoles} from "../../models/authorization/user-roles";

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  private _currentUserRole: UserRoles;

  constructor() {
    this._currentUserRole = UserRoles.USER;
  }

  get currentUserRole(): UserRoles {
    return this._currentUserRole;
  }

  set currentUserRole(value: UserRoles) {
    this._currentUserRole = value;
  }
}
