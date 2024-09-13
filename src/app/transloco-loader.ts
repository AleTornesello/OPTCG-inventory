import {inject, isDevMode} from '@angular/core';
import {Translation, TranslocoLoader} from '@jsverse/transloco';
import {HttpClient} from '@angular/common/http';

export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {
    const url = `./i18n/${lang}.json?cb=${new Date().getTime()}`;
    return this.http.get<Translation>(url);
  }
}
