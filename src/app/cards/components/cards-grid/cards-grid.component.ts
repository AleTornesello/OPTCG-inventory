import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CardPreviewComponent, CardPreviewModel} from "../card-preview/card-preview.component";
import {ScrollNearEndDirective} from "../../../shared/directives/scroll-near-end.directive";

@Component({
  selector: 'app-cards-grid',
  standalone: true,
  imports: [
    CardPreviewComponent,
    ScrollNearEndDirective
  ],
  templateUrl: './cards-grid.component.html',
  styleUrl: './cards-grid.component.scss'
})
export class CardsGridComponent {
  @Input() cards: CardPreviewModel[];
  @Output() quantityIncrease: EventEmitter<CardPreviewModel>;
  @Output() quantityDecrease: EventEmitter<CardPreviewModel>;

  constructor() {
    this.cards = [];
    this.quantityIncrease = new EventEmitter();
    this.quantityDecrease = new EventEmitter();
  }

  public onQuantityIncrease(card: CardPreviewModel) {
    this.quantityIncrease.emit(card);
  }

  public onQuantityDecrease(card: CardPreviewModel) {
    this.quantityDecrease.emit(card);
  }
}
