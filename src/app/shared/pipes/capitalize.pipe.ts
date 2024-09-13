import {Pipe, PipeTransform} from '@angular/core';
import {StringManipulationService} from "../services/string-manipulation.service";

@Pipe({
  name: 'capitalize',
  standalone: true,
})
export class CapitalizePipe implements PipeTransform {

  constructor(private _stringManipulationService: StringManipulationService) {
  }

  transform(value?: string | null, onlyFirstWord: boolean = false): string {
    if (!value) {
      return '';
    }

    if (onlyFirstWord) {
      return this._stringManipulationService.capitalize(value);
    }

    const words = value.split(' ');
    const capitalizedWords = words.map((word) => {
      const lowercaseWord = word.toLowerCase();
      return this._stringManipulationService.capitalize(lowercaseWord);
    });

    return capitalizedWords.join(' ');
  }
}
