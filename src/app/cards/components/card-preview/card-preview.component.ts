import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CardModel} from "../../models/card.model";
import {CardsService} from "../../services/cards.service";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {InputNumberComponent} from "../../../shared/components/inputs/input-number/input-number.component";
import {NgClass} from "@angular/common";

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
  @Input({required: true}) card!: CardModel;
  @Input() quantity: number;

  @Output() quantityChange : EventEmitter<number>;

  public readonly faPlus = faPlus;
  public readonly faMinus = faMinus;

  constructor(
    private _cardsListService: CardsService
  ) {
    this.quantity = 0;
    this.quantityChange = new EventEmitter<number>();
  }

  // public get cardImageUrl(): string {
  //   return this._cardsListService.getCardImageUrl(this.card);
  // }

  public onPlusClick() {
    this.quantity++;
    this._onQuantityChange();
  }

  public onMinusClick() {
    if (this.quantity <= 0) {
      return;
    }

    this.quantity--;
    this._onQuantityChange();
  }

  private _onQuantityChange() {
    this.quantityChange.emit(this.quantity);
  }
}
