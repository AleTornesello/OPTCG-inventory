import {Pipe, PipeTransform} from '@angular/core';
import {StringManipulationService} from "../services/string-manipulation.service";

@Pipe({
  name: 'camelCase',
  standalone: true,
})
export class CamelCasePipe implements PipeTransform {

  constructor(private _stringManipulationService: StringManipulationService) {
  }

  transform(value?: string | null): string {
    if (!value) {
      return '';
    }

    return this._stringManipulationService.toCamelCase(value);
  }
}
