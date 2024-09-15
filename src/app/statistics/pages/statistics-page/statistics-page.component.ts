import {Component, DestroyRef, OnInit} from '@angular/core';
import {CardsService} from "../../../cards/services/cards.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CardModel} from "../../../cards/models/card.model";
import {MeterGroupModule, MeterItem} from "primeng/metergroup";
import {TranslocoService} from "@jsverse/transloco";
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
    MeterGroupModule
  ],
  templateUrl: './statistics-page.component.html',
  styleUrl: './statistics-page.component.scss'
})
export class StatisticsPageComponent implements OnInit {

  public statistics: Map<string, Statistic>;

  constructor(
    private _cardsService: CardsService,
    private _destroyRef: DestroyRef,
    private _translateService: TranslocoService
  ) {
    this.statistics = new Map<string, Statistic>();
  }

  public ngOnInit() {
    this._cardsService.getCardsList()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        combineLatestWith(this._cardsService.getAllCardQuantities())
      )
      .subscribe({
        next: this._onCardListLoadSuccess.bind(this),
        error: this._onCardListLoadError.bind(this)
      });
  }

  private _onCardListLoadSuccess([cards, inventory]: [CardModel[], (InventoryModel | null)[]]) {
    cards
      .sort((a, b) => a.cardId[0].localeCompare(b.cardId[0]))
      .forEach((card) => {
        const cardInventory = inventory.find((inventoryCard) => inventoryCard?.key === card.key);
        const totalQuantityIncrement: number = card.category === 'Leader' || card.category === 'Stage' ? 1 : 4;
        const completedCardsIncrement: number =
          cardInventory
            ? card.category === 'Leader' || card.category === 'Stage'
              ? cardInventory.quantity >= 1
                ? 1
                : 0
              : cardInventory.quantity >= 4
                ? 4
                : 0
            : 0;

        const onGoingCardsIncrement: number =
          cardInventory
            ? card.category === 'Leader' || card.category === 'Stage'
              ? 0
              : cardInventory.quantity > 0 && cardInventory.quantity < 4
                ? 4 - cardInventory.quantity
                : 0
            : 0;

        if (this.statistics.has(card.cardId[0])) {
          const stat = this.statistics.get(card.cardId[0])!;

          this.statistics.set(card.cardId[0], {
            ...stat,
            completedCards: stat.completedCards + completedCardsIncrement,
            onGoingCards: stat.onGoingCards + onGoingCardsIncrement,
            totalCards: stat.totalCards + totalQuantityIncrement
          });
          return;
        }

        this.statistics.set(card.cardId[0], {
          excessCards: 0,
          completedCards: completedCardsIncrement,
          onGoingCards: onGoingCardsIncrement,
          totalCards: totalQuantityIncrement
        });
      })
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
    ]
  }

  public getTotalCards(key: string): number {
    return this.statistics.get(key)?.totalCards ?? 0;
  }
}
