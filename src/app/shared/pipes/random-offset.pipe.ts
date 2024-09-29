import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'randomOffset',
  standalone: true,
})
export class RandomOffsetPipe implements PipeTransform {
  constructor() {
  }

  public transform(
    value: number,
    offset: number = 20
  ): number {
    return value + (Math.floor(Math.random() * offset * 2) - offset);
  }
}
