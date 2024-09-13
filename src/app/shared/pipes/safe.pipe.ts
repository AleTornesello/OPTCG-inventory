import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
  SafeScript,
  SafeStyle,
  SafeUrl,
} from '@angular/platform-browser';

@Pipe({
  name: 'safe',
  standalone: true,
})
export class SafePipe implements PipeTransform {
  constructor(protected _sanitizer: DomSanitizer) {}

  public transform(
    value: any,
    context: SecurityContext = SecurityContext.HTML
  ): string | null {
    return this._sanitizer.sanitize(context, value);
  }
}
