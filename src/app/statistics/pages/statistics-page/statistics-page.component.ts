import {Component, OnInit} from '@angular/core';
import {CardsService} from "../../../cards/services/cards.service";
import {MeterGroupModule, MeterItem} from "primeng/metergroup";
import {TranslocoPipe, TranslocoService} from "@jsverse/transloco";
import {SetsService} from "../../../cards/services/sets.service";
import {SetModel} from "../../../cards/models/set.model";
import {RingSpinnerComponent} from "../../../shared/components/ring-spinner/ring-spinner.component";
import {CardModel} from "../../../cards/models/card.model";

interface Statistic {
  id: string;
  name: string;
  totalCards: number;
  completedCards: number;
  onGoingCards: number;
  excessCards: number;
  isLoading: boolean;
}

@Component({
  selector: 'app-statistics-page',
  standalone: true,
  imports: [
    MeterGroupModule,
    TranslocoPipe,
    RingSpinnerComponent
  ],
  templateUrl: './statistics-page.component.html',
  styleUrl: './statistics-page.component.scss'
})
export class StatisticsPageComponent implements OnInit {

  public statistics: Statistic[];
  public cardsCount: number;

  constructor(
    private _cardsService: CardsService,
    private _translateService: TranslocoService,
    private _setsService: SetsService
  ) {
    this.statistics = [];
    this.cardsCount = 0;
  }

  public async ngOnInit() {
    await this._loadSets();
  }

  private async _loadSets() {
    try {
      const sets = await this._setsService.getSetsList();
      this._onSetListLoadSuccess(sets);
    } catch (error) {
      this._onSetListLoadError(error);
    }
  }

  private _onSetListLoadSuccess(sets: SetModel[]) {
    this.statistics.push(...sets.map((set) => ({
      id: set.id,
      name: set.name,
      excessCards: 0,
      completedCards: 0,
      onGoingCards: 0,
      totalCards: 0,
      isLoading: true
    }) as Statistic));

    sets.forEach((set) => {
      this._cardsService.getCardsList(undefined, {sets: [set.id]})
        .then(({data}) => {
          const statisticIndex = this.statistics.findIndex((statistic) => statistic.id === set.id);
          if (statisticIndex < 0) {
            return;
          }

          const {
            totalCards,
            completedCards,
            onGoingCards,
            excessCards
          } = this._getStatsFromCards(data);

          this.statistics[statisticIndex].totalCards = totalCards;
          this.statistics[statisticIndex].completedCards = completedCards;
          this.statistics[statisticIndex].onGoingCards = onGoingCards;
          this.statistics[statisticIndex].excessCards = excessCards;
          this.statistics[statisticIndex].isLoading = false;
        });
    })
  }

  private _getStatsFromCards(cards: CardModel[]) {
    let totalCards: number = 0;
    let completedCards: number = 0;
    let onGoingCards: number = 0;
    let excessCards: number = 0;

    cards.forEach((card) => {
      totalCards += card.category === 'LEADER' ? 1 : 4;
      completedCards +=
        card.inventory
          ? card.category === 'LEADER'
            ? card.inventory.quantity >= 1
              ? 1
              : 0
            : card.inventory.quantity >= 4
              ? 4
              : 0
          : 0;

      onGoingCards +=
        card.inventory
          ? card.category === 'LEADER'
            ? 0
            : card.inventory.quantity > 0 && card.inventory.quantity < 4
              ? 4 - card.inventory.quantity
              : 0
          : 0;

      excessCards +=
        card.inventory
          ? card.category === 'LEADER'
            ? card.inventory.quantity > 1
              ? card.inventory.quantity - 1
              : 0
            : card.inventory.quantity > 4
              ? card.inventory.quantity - 4
              : 0
          : 0;
    });

    return {
      excessCards,
      completedCards,
      onGoingCards,
      totalCards
    };
  }

  private _onSetListLoadError(error: any) {
    console.log(error);
    // TODO add error
  }

  public getStatisticsForMeter(statistic: Statistic): MeterItem[] {
    return [
      {
        label: this._translateService.translate("statistics.completedCards"),
        color: '#34d399',
        value: statistic.completedCards
      },
      {
        label: this._translateService.translate("statistics.onGoingCards"),
        color: '#fbbf24',
        value: statistic.onGoingCards
      },
      {
        label: this._translateService.translate("statistics.excessCards"),
        color: '#ff3d32',
        value: statistic.excessCards
      },
    ]
  }

  public getTotalCards(statistic: Statistic): number {
    return statistic.totalCards + statistic.excessCards;
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
