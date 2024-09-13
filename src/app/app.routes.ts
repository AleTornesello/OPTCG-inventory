import {Routes} from '@angular/router';
import {LoginPageComponent} from './auth/pages/login-page/login-page.component';
import {EmptyLayoutComponent} from './skeleton/components/empty-layout/empty-layout.component';
import {RegisterPageComponent} from './auth/pages/register-page/register-page.component';
import {VerifyEmailPageComponent} from "./auth/pages/verify-email-page/verify-email-page.component";
import {DefaultLayoutComponent} from "./skeleton/components/default-layout/default-layout.component";
import {CardsGridPageComponent} from "./cards/pages/cards-grid-page/cards-grid-page.component";

export enum OptcgRoute {
  AUTH = 'auth',
  LOGIN = 'login',
  REGISTER = 'register',
  VERIFY_EMAIL = 'verify-email',
  CARDS = 'cards',
}

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: `/${OptcgRoute.CARDS}`,
        pathMatch: 'full',
      },
      {
        path: OptcgRoute.CARDS,
        component: DefaultLayoutComponent,
        children: [
          {
            path: '',
            component: CardsGridPageComponent
          }
        ]
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
