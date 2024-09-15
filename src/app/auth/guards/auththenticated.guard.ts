import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {OptcgRoute} from "../../app.routes";
import {FirebaseAuthService} from "../services/firebase-auth.service";

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  try {
    const authService: FirebaseAuthService = inject(FirebaseAuthService);
    const router: Router = inject(Router);
    const existSession = authService.user !== undefined;

    return existSession
      ? true
      : router.navigate([OptcgRoute.AUTH, OptcgRoute.LOGIN]);
  } catch (e) {
    return false;
  }
};


