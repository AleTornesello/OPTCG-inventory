import {Component, OnInit} from '@angular/core';
import {SetsService} from "../../services/sets.service";
import {SetModel} from "../../models/set.model";
import {DecimalPipe} from "@angular/common";
import {MeterGroupModule} from "primeng/metergroup";
import {PrimeTemplate} from "primeng/api";
import {RingSpinnerComponent} from "../../../shared/components/ring-spinner/ring-spinner.component";
import {TranslocoPipe} from "@jsverse/transloco";
import {CardsGridComponent} from "../../components/cards-grid/cards-grid.component";
import {CardPreviewModel} from "../../components/card-preview/card-preview.component";
import {CardsService} from "../../services/cards.service";
import {SettingsService} from "../../../settings/services/settings.service";
import {
  DefaultUserSettingsValue,
  UserSettingsKey,
  UserSettingsModel,
  UserSettingsValueSingleNumber
} from "../../../settings/models/user-settings.model";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {InputNumberComponent} from "../../../shared/components/inputs/input-number/input-number.component";
import {fa0, fa1, fa4} from "@fortawesome/free-solid-svg-icons";
import {CardModel} from "../../models/card.model";

@Component({
  selector: 'app-sellable-cards-page',
  standalone: true,
  imports: [
    DecimalPipe,
    MeterGroupModule,
    PrimeTemplate,
    RingSpinnerComponent,
    TranslocoPipe,
    CardsGridComponent,
    ButtonComponent,
    InputNumberComponent
  ],
  templateUrl: './sellable-cards-page.component.html',
  styleUrl: './sellable-cards-page.component.scss'
})
export class SellableCardsPageComponent implements OnInit {

  public sets: SetModel[];

  protected readonly fa1 = fa1;
  protected readonly fa4 = fa4;
  protected readonly fa0 = fa0;

  private _cardsMap: Map<string, {
    cards: CardPreviewModel[],
    loading: boolean
  }>;

  private _settings: UserSettingsModel[];

  constructor(
    private _setsService: SetsService,
    private _cardsService: CardsService,
    private _userSettingsService: SettingsService
  ) {
    this.sets = [];
    this._cardsMap = new Map();
    this._settings = [];
  }

  public async ngOnInit() {
    this.sets = await this._setsService.getSetsList();
    this._settings = await this._userSettingsService.getUserSettingsList();

    for (const set of this.sets) {
      this._cardsMap.set(set.id, {
        cards: [],
        loading: true
      });

      this._cardsService.getCardsList(
        undefined,
        {
          sets: [set.id],
        }
      )
        .then((response) => {
          this._cardsMap.set(
            set.id,
            {
              cards: response.data
                .filter((card) => this._getExceededQuantity(card) > 0)
                .map((card) => ({
                  card,
                  quantity: this._getExceededQuantity(card)
                })),
              loading: false
            }
          )
        });
    }
  }

  private _getExceededQuantity(card: CardModel): number {
    const leaderMinCardsAmount = (this._settings.find((s) => s.key === UserSettingsKey.LEADER_MIN_CARD_AMOUNT)?.value as UserSettingsValueSingleNumber | undefined)?.value as number ?? DefaultUserSettingsValue.LEADER_MIN_CARD_AMOUNT;
    const donMinCardsAmount = (this._settings.find((s) => s.key === UserSettingsKey.DON_MIN_CARD_AMOUNT)?.value as UserSettingsValueSingleNumber | undefined)?.value as number ?? DefaultUserSettingsValue.DON_MIN_CARD_AMOUNT;
    const otherMinCardsAmount = (this._settings.find((s) => s.key === UserSettingsKey.OTHER_MIN_CARD_AMOUNT)?.value as UserSettingsValueSingleNumber | undefined)?.value as number ?? DefaultUserSettingsValue.OTHER_MIN_CARD_AMOUNT;

    if (card.category === "LEADER") {
      return card.inventory ? card.inventory.quantity - leaderMinCardsAmount : 0;
    }
    if (card.category === "DON") {
      return card.inventory ? card.inventory.quantity - donMinCardsAmount : 0;
    }
    return card.inventory ? card.inventory.quantity - otherMinCardsAmount : 0;
  }

  public getCardsBySetId(setId: string): CardPreviewModel[] {
    return this._cardsMap.get(setId)?.cards || [];
  }

  public isSetLoading(setId: string): boolean {
    return this._cardsMap.get(setId)?.loading || false;
  }

  public canSellFourCards(card: CardPreviewModel): boolean {
    return card.card.category !== "LEADER" && card.card.category !== "DON" && card.quantity >= 4;
  }

  public canSellTenCards(card: CardPreviewModel): boolean {
    return card.card.category === "DON" && card.quantity >= 10;
  }
}
