import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CardModel} from "../../models/card.model";
import {CardsService} from "../../services/cards.service";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {InputNumberComponent} from "../../../shared/components/inputs/input-number/input-number.component";
import {NgClass} from "@angular/common";

export interface CardPreviewModel {
  card: CardModel;
  quantity: number;
}

@Component({
  selector: 'app-card-preview',
  standalone: true,
  imports: [
    ButtonComponent,
    InputTextComponent,
    InputNumberComponent,
    NgClass
  ],
  templateUrl: './card-preview.component.html',
  styleUrl: './card-preview.component.scss'
})
export class CardPreviewComponent {
  @Input({required: true}) card!: CardPreviewModel;

  @Output() quantityIncrease: EventEmitter<number>;
  @Output() quantityDecrease: EventEmitter<number>;

  public readonly faPlus = faPlus;
  public readonly faMinus = faMinus;

  constructor(
  ) {
    this.quantityIncrease = new EventEmitter();
    this.quantityDecrease = new EventEmitter();
  }

  // public get cardImageUrl(): string {
  //   return this._cardsListService.getCardImageUrl(this.card);
  // }

  public onPlusClick() {
    this.card.quantity++;
    this.quantityIncrease.emit();
  }

  public onMinusClick() {
    if (this.card.quantity <= 0) {
      return;
    }

    this.card.quantity--;
    this.quantityDecrease.emit();
  }

  public get canDecreaseQuantity(): boolean {
    return this.card.quantity > 0;
  }
}
