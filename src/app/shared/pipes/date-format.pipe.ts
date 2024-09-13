import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(
    value: string | Date | null | undefined,
    format: string = 'DD/MM/YYYY'
  ): string | null {
    if (!value) {
      return null;
    }

    return dayjs(value).format(format);
  }
}
