import {Routes} from '@angular/router';
import {LoginPageComponent} from './auth/pages/login-page/login-page.component';
import {EmptyLayoutComponent} from './skeleton/components/empty-layout/empty-layout.component';
import {RegisterPageComponent} from './auth/pages/register-page/register-page.component';
import {VerifyEmailPageComponent} from "./auth/pages/verify-email-page/verify-email-page.component";

export enum OptcgRoute {
  AUTH = 'auth',
  LOGIN = 'login',
  REGISTER = 'register',
  VERIFY_EMAIL = 'verify-email',
}

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: `/${OptcgRoute.AUTH}/${OptcgRoute.LOGIN}`,
        pathMatch: 'full',
      },
      {
        path: OptcgRoute.AUTH,
        component: EmptyLayoutComponent,
        children: [
          {
            path: OptcgRoute.LOGIN,
            component: LoginPageComponent,
          },
          {
            path: OptcgRoute.REGISTER,
            component: RegisterPageComponent,
          },
          {
            path: OptcgRoute.VERIFY_EMAIL,
            component: VerifyEmailPageComponent,
          },
        ],
      },
    ]
  },
];
