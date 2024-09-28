import {Component, OnInit} from '@angular/core';
import {SetsService} from "../../services/sets.service";
import {SetModel} from "../../models/set.model";
import {DecimalPipe} from "@angular/common";
import {MeterGroupModule} from "primeng/metergroup";
import {ConfirmationService, PrimeTemplate} from "primeng/api";
import {RingSpinnerComponent} from "../../../shared/components/ring-spinner/ring-spinner.component";
import {TranslocoPipe, TranslocoService} from "@jsverse/transloco";
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
import {CardModel} from "../../models/card.model";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {InventoryService} from "../../services/inventory.service";

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
    InputNumberComponent,
    ConfirmDialogModule
  ],
  templateUrl: './sellable-cards-page.component.html',
  styleUrl: './sellable-cards-page.component.scss'
})
export class SellableCardsPageComponent implements OnInit {

  public sets: SetModel[];

  private _cardsMap: Map<string, {
    cards: CardPreviewModel[],
    loading: boolean
  }>;

  private _settings: UserSettingsModel[];

  constructor(
    private _setsService: SetsService,
    private _cardsService: CardsService,
    private _userSettingsService: SettingsService,
    private _confirmationService: ConfirmationService,
    private _translocoService: TranslocoService,
    private _inventoryService: InventoryService
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

  public onSellOneCardClick(event: Event, card: CardPreviewModel) {
    this._onSellCard(event, card, 1);
  }

  public onSellFourCardsClick(event: Event, card: CardPreviewModel) {
    this._onSellCard(event, card, 4);
  }

  public onSellTenCardsClick(event: Event, card: CardPreviewModel) {
    this._onSellCard(event, card, 10);
  }

  private _onSellCard(event: Event, card: CardPreviewModel, quantity: number) {
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: this._translocoService.translate("sell.confirmSellMessage", {quantity: quantity, name: card.card.name}),
      header: this._translocoService.translate("sell.confirmSellTitle"),
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: this._translocoService.translate("sell.sell"),
      rejectLabel: this._translocoService.translate("common.no"),
      rejectButtonStyleClass: "p-button-text",
      accept: this._onAcceptSellCard.bind(this, card, quantity),
    });
  }

  private async _onAcceptSellCard(card: CardPreviewModel, quantity: number) {
    try {
      const inventory = (await this._inventoryService.upsertInventory(
        card.card,
        card.card.inventory!.quantity - quantity
      ))[0]

      card.card.inventory = inventory;
      card.quantity = this._getExceededQuantity(card.card);

      if (this._getExceededQuantity(card.card) <= 0) {
        this._cardsMap.set(
          card.card.setId,
          {
            cards: this._cardsMap.get(card.card.setId)?.cards.filter((c) => c.card.id !== card.card.id) || [],
            loading: false
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}
