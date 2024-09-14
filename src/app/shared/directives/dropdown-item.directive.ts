import { Directive, TemplateRef } from '@angular/core';

export interface DropdownItemTemplateContext {
  $implicit: any;
}

@Directive({
  selector: '[appDropdownItem]',
})
export class DropdownItemDirective {
  constructor(readonly template: TemplateRef<DropdownItemTemplateContext>) {}
}
