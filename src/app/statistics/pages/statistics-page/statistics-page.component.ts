import {Component, DestroyRef, OnInit} from '@angular/core';
import {CardsService} from "../../../cards/services/cards.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CardModel} from "../../../cards/models/card.model";
import {MeterGroupModule, MeterItem} from "primeng/metergroup";
import {TranslocoPipe, TranslocoService} from "@jsverse/transloco";
import {combineLatestWith} from "rxjs";
import {InventoryModel} from "../../../cards/models/inventory.model";

interface Statistic {
  totalCards: number;
  completedCards: number;
  onGoingCards: number;
  excessCards: number;
}

@Component({
  selector: 'app-statistics-page',
  standalone: true,
  imports: [
    MeterGroupModule,
    TranslocoPipe
  ],
  templateUrl: './statistics-page.component.html',
  styleUrl: './statistics-page.component.scss'
})
export class StatisticsPageComponent implements OnInit {

  public statistics: Map<string, Statistic>;

  private _cards: CardModel[];
  private _inventory: InventoryModel[];

  constructor(
    private _cardsService: CardsService,
    private _destroyRef: DestroyRef,
    private _translateService: TranslocoService
  ) {
    this.statistics = new Map<string, Statistic>();
    this._cards = [];
    this._inventory = [];
  }

  public ngOnInit() {
    // this._cardsService.getCardsList()
    //   .pipe(
    //     takeUntilDestroyed(this._destroyRef),
    //     combineLatestWith(this._cardsService.getAllCardQuantities())
    //   )
    //   .subscribe({
    //     next: this._onCardListLoadSuccess.bind(this),
    //     error: this._onCardListLoadError.bind(this)
    //   });
  }

  private _onCardListLoadSuccess([cards, inventory]: [CardModel[], InventoryModel[]]) {
    this._cards = cards;
    this._inventory = inventory;
    // cards
    //   .sort((a, b) => a.cardId[0].localeCompare(b.cardId[0]))
    //   .forEach((card) => {
    //     const cardInventory = inventory.find((inventoryCard) => inventoryCard?.key === card.key);
    //     const totalQuantityIncrement: number = card.category === 'Leader' ? 1 : 4;
    //     const completedCardsIncrement: number =
    //       cardInventory
    //         ? card.category === 'Leader'
    //           ? cardInventory.quantity >= 1
    //             ? 1
    //             : 0
    //           : cardInventory.quantity >= 4
    //             ? 4
    //             : 0
    //         : 0;
    //
    //     const onGoingCardsIncrement: number =
    //       cardInventory
    //         ? card.category === 'Leader'
    //           ? 0
    //           : cardInventory.quantity > 0 && cardInventory.quantity < 4
    //             ? 4 - cardInventory.quantity
    //             : 0
    //         : 0;
    //
    //     const excessCardsIncrement: number =
    //       cardInventory
    //         ? card.category === 'Leader'
    //           ? cardInventory.quantity > 1
    //             ? cardInventory.quantity - 1
    //             : 0
    //           : cardInventory.quantity > 4
    //             ? cardInventory.quantity - 4
    //             : 0
    //         : 0;
    //
    //     if (this.statistics.has(card.cardId[0])) {
    //       const stat = this.statistics.get(card.cardId[0])!;
    //
    //       this.statistics.set(card.cardId[0], {
    //         completedCards: stat.completedCards + completedCardsIncrement,
    //         onGoingCards: stat.onGoingCards + onGoingCardsIncrement,
    //         totalCards: stat.totalCards + totalQuantityIncrement,
    //         excessCards: stat.excessCards + excessCardsIncrement
    //       });
    //       return;
    //     }
    //
    //     this.statistics.set(card.cardId[0], {
    //       excessCards: excessCardsIncrement,
    //       completedCards: completedCardsIncrement,
    //       onGoingCards: onGoingCardsIncrement,
    //       totalCards: totalQuantityIncrement
    //     });
    //   })
  }

  private _onCardListLoadError() {
    // TODO add error
  }

  public getSets(): string[] {
    return Array.from(this.statistics.keys());
  }

  public getStatisticsForMeter(key: string): MeterItem[] {
    const card = this.statistics.get(key);

    if (!card) {
      return [];
    }

    return [
      {
        label: this._translateService.translate("statistics.completedCards"),
        color: '#34d399',
        value: card.completedCards
      },
      {label: this._translateService.translate("statistics.onGoingCards"), color: '#fbbf24', value: card.onGoingCards},
      {label: this._translateService.translate("statistics.excessCards"), color: '#ff3d32', value: card.excessCards},
    ]
  }

  public getTotalCards(key: string): number {
    const card = this.statistics.get(key);
    if (!card) {
      return 0;
    }
    return card.totalCards + card.excessCards;
  }

  public get cardsCount(): number {
    return this._cards.length;
  }

  public get totalSingleCards(): number {
    // return this._cards.filter((card) => {
    //   const cardInventory = this._inventory.find((inventoryCard) => inventoryCard?.key === card.key);
    //
    //   if (!cardInventory) {
    //     return false;
    //   }
    //
    //   return cardInventory.quantity > 0;
    // }).length
    return 0
  }

  public get totalExcessCards(): number {
    // return this._cards
    //   .map((card) => {
    //     const cardInventory = this._inventory.find((inventoryCard) => inventoryCard?.key === card.key);
    //
    //     // Exclude cards that are not in the inventory or the quantity is 0
    //     if (!cardInventory || cardInventory.quantity === 0) {
    //       return 0;
    //     }
    //
    //     // If the card is a leader or stage, only decrement the quantity by 1 (the minimum quantity to be in a full set)
    //     if (card.category === 'Leader') {
    //       return cardInventory.quantity - 1;
    //     }
    //
    //     // Excludes all cards that are not a leader or stage and the quantity is less than 4
    //     if (cardInventory.quantity < 4) {
    //       return 0;
    //     }
    //
    //     // If the card is not a leader or stage, decrement the quantity by 4
    //     return cardInventory.quantity - 4;
    //   }).reduce((a, b) => a + b, 0);
    return 0;
  }
}
