import {Component, DestroyRef, OnInit} from '@angular/core';
import {CardsListService} from "../../services/cards-list.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CardModel} from "../../models/card.model";
import {CardPreviewComponent} from "../../components/card-preview/card-preview.component";
import {ScrollNearEndDirective} from "../../../shared/directives/scroll-near-end.directive";

@Component({
  selector: 'app-cards-grid-page',
  standalone: true,
  imports: [
    CardPreviewComponent,
    ScrollNearEndDirective
  ],
  templateUrl: './cards-grid-page.component.html',
  styleUrl: './cards-grid-page.component.scss'
})
export class CardsGridPageComponent implements OnInit {

  public visibleCards: CardModel[];
  public allCards: CardModel[];

  private readonly _cardsLoadRange: number;

  constructor(
    private _cardsListService: CardsListService,
    private _destroyRef: DestroyRef
  ) {
    this.visibleCards = [];
    this.allCards = [];
    this._cardsLoadRange = 20;
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
    this.allCards = cards;
    this.visibleCards = cards.slice(0, this._cardsLoadRange);
  }

  private _onCardsListLoadError() {
    // TODO: handle error
  }

  public onNearEndScroll() {
    debugger
    this.visibleCards.push(...this.allCards.slice(this.visibleCards.length, this.visibleCards.length + this._cardsLoadRange));
  }
}
