import {inject, isDevMode} from '@angular/core';
import {Translation, TranslocoLoader} from '@jsverse/transloco';
import {HttpClient} from '@angular/common/http';
import {PrimeNGConfig} from "primeng/api";
import {combineLatestWith, map, tap} from "rxjs";

export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);
  private primeNGConfig = inject(PrimeNGConfig);

  getTranslation(lang: string) {
    const translocoUrl = `./i18n/${lang}.json?cb=${new Date().getTime()}`;
    const primeNgUrl = `./i18n/primeng/${lang}.json?cb=${new Date().getTime()}`;

    return this.http.get<Translation>(primeNgUrl)
      .pipe(
        tap((response) => this.primeNGConfig.setTranslation(response)),
        combineLatestWith(this.http.get<Translation>(translocoUrl)),
        map(([primeNG, transloco]) => transloco),
      );
  }
}
