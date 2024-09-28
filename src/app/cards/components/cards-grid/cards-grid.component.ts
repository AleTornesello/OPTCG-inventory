import {Component, ContentChild, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {CardPreviewComponent, CardPreviewModel} from "../card-preview/card-preview.component";
import {ScrollNearEndDirective} from "../../../shared/directives/scroll-near-end.directive";
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-cards-grid',
  standalone: true,
  imports: [
    CardPreviewComponent,
    ScrollNearEndDirective,
    NgTemplateOutlet
  ],
  templateUrl: './cards-grid.component.html',
  styleUrl: './cards-grid.component.scss'
})
export class CardsGridComponent {
  @ContentChild(TemplateRef) templateRef: TemplateRef<any> | null;

  @Input() cards: CardPreviewModel[];

  constructor() {
    this.cards = [];
    this.templateRef = null;
  }
}
