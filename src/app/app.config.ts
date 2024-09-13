import {APP_INITIALIZER, ApplicationConfig, isDevMode, LOCALE_ID, provideZoneChangeDetection,} from '@angular/core';
import {provideRouter, withHashLocation} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimations,} from '@angular/platform-browser/animations';
import {provideHttpClient} from '@angular/common/http';
import {TranslocoHttpLoader} from './transloco-loader';
import {provideTransloco, Translation, TranslocoService,} from '@jsverse/transloco';
import {lastValueFrom} from 'rxjs';
import {provideTranslocoMessageformat} from "@jsverse/transloco-messageformat";
import {MessageService} from "primeng/api";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {environment} from "../environments/environment";
import {getAuth, provideAuth} from "@angular/fire/auth";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes, withHashLocation()),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    {
      provide: LOCALE_ID,
      useValue: navigator.language,
    },
    provideTransloco({
      config: {
        availableLangs: ['en', 'it'],
        defaultLang: navigator.language.includes('-')
          ? navigator.language.split('-')[0]
          : navigator.language,
        prodMode: !isDevMode(),
        fallbackLang: 'en',
      },
      loader: TranslocoHttpLoader,
    }),
    provideTranslocoMessageformat(),
    {
      provide: APP_INITIALIZER,
      useFactory: (translateService: TranslocoService) => {
        return (): Promise<Translation> => {
          const defaultLang = translateService.getDefaultLang();
          translateService.setActiveLang(defaultLang);
          translateService.getTranslation(defaultLang);
          return lastValueFrom(translateService.load(defaultLang));
        };
      },
      deps: [TranslocoService],
      multi: true,
    },
    MessageService
  ],
};
