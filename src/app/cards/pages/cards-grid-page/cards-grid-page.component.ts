import {Component, DestroyRef, OnInit} from '@angular/core';
import {CardsService} from "../../services/cards.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CardModel} from "../../models/card.model";
import {CardPreviewComponent} from "../../components/card-preview/card-preview.component";
import {ScrollNearEndDirective} from "../../../shared/directives/scroll-near-end.directive";
import {forkJoin} from "rxjs";
import {InventoryModel} from "../../models/inventory.model";
import {FirebaseError} from "@firebase/util";

interface CardPreviewModel {
  card: CardModel;
  quantity: number;
}

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

  public visibleCards: CardPreviewModel[];
  public allCards: CardModel[];

  private readonly _cardsLoadRange: number;

  constructor(
    private _cardsListService: CardsService,
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
    this._loadNextCards();
  }

  private _onCardsListLoadError() {
    // TODO: handle error
  }

  public onNearEndScroll() {
    this._loadNextCards();
  }

  private _loadNextCards() {
    if (this.visibleCards.length >= this.allCards.length) {
      return;
    }
    const newCards = this.allCards
      .slice(this.visibleCards.length, this.visibleCards.length + this._cardsLoadRange)
      .map((card) => ({
        card,
        quantity: 0
      }));
    this.visibleCards.push(...newCards);

    forkJoin(newCards.map((card) => this._cardsListService.getCardQuantity(card.card)))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this._onCardsQuantityLoadSuccess.bind(this),
        error: this._onCardsQuantityLoadError.bind(this)
      });
  }

  private _onCardsQuantityLoadSuccess(quantities: (InventoryModel | null)[]) {
    quantities.forEach((inventory) => {
      if(inventory === null) {
        return;
      }

      const card = this.visibleCards.find((card) => card.card.key === inventory?.key)!;

      if(card === null || card === undefined) {
        return;
      }

      card.quantity = inventory.quantity;
    });
  }

  private _onCardsQuantityLoadError(error: any) {
    console.log(error)
    // TODO: handle error
  }

  public onCardQuantityChange(card: CardPreviewModel, newQuantity: number) {
    card.quantity = newQuantity;

    this._cardsListService.updateCardQuantity(card.card, newQuantity)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this._onCardQuantityUpdateSuccess.bind(this),
        error: this._onCardQuantityUpdateError.bind(this)
      });
  }

  private _onCardQuantityUpdateSuccess() {
    // TODO: handle success
  }

  private _onCardQuantityUpdateError(error: any) {
    console.log(error)
    // TODO: handle error
  }
}
