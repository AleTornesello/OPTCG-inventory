import {Pipe, PipeTransform} from '@angular/core';
import {StringManipulationService} from "../services/string-manipulation.service";

@Pipe({
  name: 'camelToKebab',
  standalone: true,
})
export class CamelToKebabPipe implements PipeTransform {
  constructor(private _stringManipulationService: StringManipulationService) {
  }
  transform(value: string | undefined | null): string | undefined {
    if (!value) {
      return undefined;
    }

    return this._stringManipulationService.camelToKebab(value);
  }
}
