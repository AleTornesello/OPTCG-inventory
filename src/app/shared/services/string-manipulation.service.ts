import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringManipulationService {

  constructor() {
  }

  public camelToKebab(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  public kebabToCamel(str: string): string {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

  public snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  }

  public capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  public toSnakeCase(str: string): string {
    return str.toLowerCase().replace(" ", "_");
  }

  public toCamelCase(str: string): string {
    return str
      .split(" ")
      .map((s, i) => {
        if (i === 0) {
          return s.toLowerCase();
        }
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
      })
      .join("");
  }
}
