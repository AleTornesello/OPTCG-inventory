import {Component, OnInit} from '@angular/core';
import {CardsService} from "../../../cards/services/cards.service";
import {MeterGroupModule, MeterItem} from "primeng/metergroup";
import {TranslocoPipe, TranslocoService} from "@jsverse/transloco";
import {SetsService} from "../../../cards/services/sets.service";
import {SetModel} from "../../../cards/models/set.model";
import {RingSpinnerComponent} from "../../../shared/components/ring-spinner/ring-spinner.component";
import {CardModel} from "../../../cards/models/card.model";
import {CheckboxComponent} from "../../../shared/components/inputs/checkbox/checkbox.component";
import {FormsModule} from "@angular/forms";
import {SettingsService} from "../../../settings/services/settings.service";
import {
  DefaultUserSettingsValue,
  UserSettingsKey,
  UserSettingsModel,
  UserSettingsValueSingleNumber
} from "../../../settings/models/user-settings.model";
import {DecimalPipe} from "@angular/common";
import {SkeletonModule} from "primeng/skeleton";
import {RandomOffsetPipe} from "../../../shared/pipes/random-offset.pipe";

interface Statistic {
  id: string;
  name: string;
  singleCardsCount: number;
  singleCardsCompletedCount: number;
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
    RingSpinnerComponent,
    CheckboxComponent,
    FormsModule,
    DecimalPipe,
    SkeletonModule,
    RandomOffsetPipe
  ],
  templateUrl: './statistics-page.component.html',
  styleUrl: './statistics-page.component.scss'
})
export class StatisticsPageComponent implements OnInit {

  public statistics: Statistic[];
  public cardsCount: number;

  public includeSpecial: boolean;
  public includeAlternateArt: boolean;
  public includeDon: boolean;

  private _sets: SetModel[];
  private _settings: UserSettingsModel[];

  constructor(
    private _cardsService: CardsService,
    private _translateService: TranslocoService,
    private _setsService: SetsService,
    private _userSettingsService: SettingsService
  ) {
    this.statistics = [];
    this.cardsCount = 0;
    this.includeSpecial = false;
    this.includeAlternateArt = false;
    this.includeDon = false;

    this._sets = [];
    this._settings = [];
  }

  public async ngOnInit() {
    await this._loadSettings();
    await this._loadSets();
  }

  private async _loadSettings() {
    try {
      this._settings = await this._userSettingsService.getUserSettingsList();
    } catch (error) {
      // TODO: handle error
      console.error(error);
    }
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
    this._sets = sets;
    this.statistics.push(...sets.map((set) => ({
      id: set.id,
      name: set.name,
      excessCards: 0,
      completedCards: 0,
      onGoingCards: 0,
      totalCards: 0,
      singleCardsCount: 0,
      singleCardsCompletedCount: 0,
      isLoading: true
    }) as Statistic));
    this._updateStatistics(sets);
  }

  private _updateStatistics(sets: SetModel[]) {
    sets.forEach((set) => {
      this._cardsService.getCardsList(undefined, {sets: [set.id]})
        .then(({data}) => {
          const filteredCards = data.filter((card) => {
            if (card.rarity === "ALTERNATE ART") {
              return this.includeAlternateArt;
            }

            if (card.rarity === "SPECIAL") {
              return this.includeSpecial;
            }

            if (card.category === "DON") {
              return this.includeDon;
            }

            return true;
          });

          const statisticIndex = this.statistics.findIndex((statistic) => statistic.id === set.id);
          if (statisticIndex < 0) {
            return;
          }

          const {
            totalCards,
            completedCards,
            onGoingCards,
            excessCards
          } = this._getStatsFromCards(filteredCards);

          this.statistics[statisticIndex].totalCards = totalCards;
          this.statistics[statisticIndex].singleCardsCount = filteredCards.length;
          this.statistics[statisticIndex].singleCardsCompletedCount = filteredCards.filter((card) => card.inventory && card.inventory.quantity > 0).length;
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
      totalCards += this._getCardMinQuantityByCategory(card);
      completedCards +=
        card.inventory
          ? card.inventory.quantity >= this._getCardMinQuantityByCategory(card)
            ? this._getCardMinQuantityByCategory(card)
            : 0
          : 0;

      onGoingCards +=
        card.inventory
          ? card.inventory.quantity > 0 && card.inventory.quantity < this._getCardMinQuantityByCategory(card)
            ? this._getCardMinQuantityByCategory(card) - card.inventory.quantity
            : 0
          : 0;

      excessCards +=
        card.inventory
          ? card.inventory.quantity > this._getCardMinQuantityByCategory(card)
            ? card.inventory.quantity - this._getCardMinQuantityByCategory(card)
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

  private _getCardMinQuantityByCategory(card: CardModel): number {
    if (card.category === "LEADER") {
      return (this._settings.find((setting) => setting.key === UserSettingsKey.LEADER_MIN_CARD_AMOUNT)?.value as UserSettingsValueSingleNumber).value ?? DefaultUserSettingsValue.LEADER_MIN_CARD_AMOUNT;
    }

    if (card.category === "DON") {
      return (this._settings.find((setting) => setting.key === UserSettingsKey.DON_MIN_CARD_AMOUNT)?.value as UserSettingsValueSingleNumber).value ?? DefaultUserSettingsValue.DON_MIN_CARD_AMOUNT;
    }

    return (this._settings.find((setting) => setting.key === UserSettingsKey.OTHER_MIN_CARD_AMOUNT)?.value as UserSettingsValueSingleNumber).value ?? DefaultUserSettingsValue.OTHER_MIN_CARD_AMOUNT;
  }

  public getTotalCards(statistic: Statistic): number {
    return statistic.totalCards + statistic.excessCards;
  }

  public get totalSingleCards(): number {
    return this.statistics.reduce(
      (acc, stat) => acc + stat.singleCardsCount,
      0
    );
  }

  public get totalSingleCardsCompleted(): number {
    return this.statistics.reduce(
      (acc, stat) => acc + stat.singleCardsCompletedCount,
      0
    );
  }

  public get totalExcessCards(): number {
    return this.statistics
      .reduce((acc, stat) => acc + stat.excessCards, 0);
  }

  public onFiltersChange(): void {
    this._updateStatistics(this._sets);
  }
}
