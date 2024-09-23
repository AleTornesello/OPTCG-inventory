import {Routes} from '@angular/router';
import {LoginPageComponent} from './auth/pages/login-page/login-page.component';
import {EmptyLayoutComponent} from './skeleton/components/empty-layout/empty-layout.component';
import {RegisterPageComponent} from './auth/pages/register-page/register-page.component';
import {VerifyEmailPageComponent} from "./auth/pages/verify-email-page/verify-email-page.component";
import {DefaultLayoutComponent} from "./skeleton/components/default-layout/default-layout.component";
import {CardsGridPageComponent} from "./cards/pages/cards-grid-page/cards-grid-page.component";
import {StatisticsPageComponent} from "./statistics/pages/statistics-page/statistics-page.component";
import {authGuard} from "./auth/guards/auththenticated.guard";
import {UserSettingsPageComponent} from "./settings/pages/user-settings-page/user-settings-page.component";

export enum OptcgRoute {
  AUTH = 'auth',
  LOGIN = 'login',
  REGISTER = 'register',
  VERIFY_EMAIL = 'verify-email',
  CARDS = 'cards',
  STATISTICS = 'statistics',
  SETTINGS = 'settings',
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
        canActivate: [authGuard],
        children: [
          {
            path: '',
            component: CardsGridPageComponent
          }
        ]
      },
      {
        path: OptcgRoute.STATISTICS,
        component: DefaultLayoutComponent,
        canActivate: [authGuard],
        children: [
          {
            path: '',
            component: StatisticsPageComponent
          }
        ]
      },
      {
        path: OptcgRoute.SETTINGS,
        component: DefaultLayoutComponent,
        canActivate: [authGuard],
        children: [
          {
            path: '',
            component: UserSettingsPageComponent
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
