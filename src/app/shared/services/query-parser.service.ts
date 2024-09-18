import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QueryParserService {
  constructor() {}

  parse(query: string | null | undefined) {
    if (query === null || query === undefined || query === '') {
      return '';
    }

    const words = query.split(' ');
    return `'${words.join("':* & '")}':*`;
  }
}
