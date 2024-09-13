import { Directive, Input, TemplateRef } from '@angular/core';
import { CellTemplateContext } from '../components/table/generic-table/generic-table.component';

@Directive({
  selector: '[appTableCell]',
  standalone: true,
})
export class TableCellDirective {
  @Input('appTableCell')
  get field(): string {
    return this._field;
  }
  set field(field: string) {
    this._field = field;
  }

  private _field: string;

  constructor(readonly template: TemplateRef<CellTemplateContext>) {
    this._field = '';
  }
}
