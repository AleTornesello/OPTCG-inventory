import {Component, Input} from '@angular/core';
import {CardModel} from "../../models/card.model";
import {CardsListService} from "../../services/cards-list.service";

@Component({
  selector: 'app-card-preview',
  standalone: true,
  imports: [],
  templateUrl: './card-preview.component.html',
  styleUrl: './card-preview.component.scss'
})
export class CardPreviewComponent {
  @Input({required: true}) card!: CardModel;

  constructor(
    private _cardsListService: CardsListService
  ) {
  }

  public get cardImageUrl(): string {
    return this._cardsListService.getCardImageUrl(this.card);
  }
}
