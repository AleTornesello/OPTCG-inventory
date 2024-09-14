import {Component, Input} from '@angular/core';
import {CardModel} from "../../models/card.model";
import {CardsListService} from "../../services/cards-list.service";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";

@Component({
  selector: 'app-card-preview',
  standalone: true,
  imports: [
    ButtonComponent,
    InputTextComponent
  ],
  templateUrl: './card-preview.component.html',
  styleUrl: './card-preview.component.scss'
})
export class CardPreviewComponent {
  @Input({required: true}) card!: CardModel;

  public readonly faPlus = faPlus;
  public readonly faMinus = faMinus;

  constructor(
    private _cardsListService: CardsListService
  ) {
  }

  public get cardImageUrl(): string {
    return this._cardsListService.getCardImageUrl(this.card);
  }
}
