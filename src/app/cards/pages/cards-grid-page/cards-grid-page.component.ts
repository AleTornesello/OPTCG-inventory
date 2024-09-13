import {Component, DestroyRef, OnInit} from '@angular/core';
import {CardsListService} from "../../services/cards-list.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CardModel} from "../../models/card.model";
import {CardPreviewComponent} from "../../components/card-preview/card-preview.component";

@Component({
  selector: 'app-cards-grid-page',
  standalone: true,
  imports: [
    CardPreviewComponent
  ],
  templateUrl: './cards-grid-page.component.html',
  styleUrl: './cards-grid-page.component.scss'
})
export class CardsGridPageComponent implements OnInit {

  public cards: CardModel[];

  constructor(
    private _cardsListService: CardsListService,
    private _destroyRef: DestroyRef
  ) {
    this.cards = [];
  }

  public ngOnInit() {
    this._cardsListService.getCardsList()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this._onCardsListLoadSuccess.bind(this),
        error: this._onCardsListLoadError.bind(this)
      });
  }

  private _onCardsListLoadSuccess(cards: CardModel[]) {
    // TODO: remove slice, only for test
    this.cards = cards.slice(0,20);
  }

  private _onCardsListLoadError() {
    // TODO: handle error
  }
}
