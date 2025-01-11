import {Component, OnInit} from '@angular/core';
import {CardsService} from "../../services/cards.service";
import {CardModel, MAX_COST, MAX_POWER, MIN_COST, MIN_POWER} from "../../models/card.model";
import {CardPreviewComponent, CardPreviewModel} from "../../components/card-preview/card-preview.component";
import {ScrollNearEndDirective} from "../../../shared/directives/scroll-near-end.directive";
import {AccordionModule} from "primeng/accordion";
import {TranslocoPipe, TranslocoService} from "@jsverse/transloco";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {DropdownComponent} from "../../../shared/components/inputs/dropdown/dropdown.component";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {FormsModule} from "@angular/forms";
import {SetsService} from "../../services/sets.service";
import {SetModel} from "../../models/set.model";
import {RingSpinnerComponent} from "../../../shared/components/ring-spinner/ring-spinner.component";
import {InventoryService} from "../../services/inventory.service";
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {ActivatedRoute, Router} from "@angular/router";
import {StringManipulationService} from "../../../shared/services/string-manipulation.service";
import {CheckboxComponent} from "../../../shared/components/inputs/checkbox/checkbox.component";
import {InputSliderComponent} from "../../../shared/components/inputs/input-slider/input-slider.component";
import {CardsGridComponent} from "../../components/cards-grid/cards-grid.component";
import {InputNumberComponent} from "../../../shared/components/inputs/input-number/input-number.component";
import {ChipModule} from "primeng/chip";
import {v4 as uuidv4} from 'uuid';
import {ChipComponent} from "../../../shared/components/chip/chip.component";
import {CardFilters, CardsFilterPanelComponent} from "../../components/cards-filter-panel/cards-filter-panel.component";

type FilterType = 'colors' | 'sets' | 'rarities' | 'power' | 'costs' | 'searchText' | 'showOnlyOwned';

interface FilterChip {
  // Identifier used for local tracking
  id: string;
  label: string;
  type: FilterType;
  value?: string | number | boolean;
}

@Component({
  selector: 'app-cards-grid-page',
  standalone: true,
  imports: [
    CardPreviewComponent,
    ScrollNearEndDirective,
    AccordionModule,
    TranslocoPipe,
    FaIconComponent,
    DropdownComponent,
    ButtonComponent,
    FormsModule,
    RingSpinnerComponent,
    InputTextComponent,
    CheckboxComponent,
    InputSliderComponent,
    CardsGridComponent,
    InputNumberComponent,
    ChipModule,
    ChipComponent,
    CardsFilterPanelComponent,
  ],
  templateUrl: './cards-grid-page.component.html',
  styleUrl: './cards-grid-page.component.scss'
})
export class CardsGridPageComponent implements OnInit {

  public cards: CardPreviewModel[];
  public cardColors: string[];
  public cardSets: SetModel[];
  public cardRarities: string[];
  public filters: CardFilters;

  public isLoadingInProgress: boolean;

  protected readonly faPlus = faPlus;
  protected readonly faMinus = faMinus;
  protected readonly cardsPerPage: number = 15;
  protected readonly loadingCardsPerPage: number = 5;

  private _page: number;
  private _cardsTotalCount: number | null;

  constructor(
    private _cardsListService: CardsService,
    private _translateService: TranslocoService,
    private _setsService: SetsService,
    private _inventoryService: InventoryService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _stringManipulationService: StringManipulationService
  ) {
    this.cards = [];
    this.cardColors = [];
    this.cardSets = [];
    this.cardRarities = [];
    this._page = 0;
    this.isLoadingInProgress = false;
    this._cardsTotalCount = null;
    this.filters = {
      colors: [],
      sets: [],
      rarities: [],
      power: [MIN_POWER, MAX_POWER],
      costs: [MIN_COST, MAX_COST],
      searchText: '',
      showOnlyOwned: false
    };
  }

  public ngOnInit() {
    this._route.queryParams.subscribe(async (params) => {
      this.filters = {
        searchText: params['searchText'] ?? this.filters.searchText,
        showOnlyOwned: params['showOnlyOwned'] !== null && params['showOnlyOwned'] !== undefined
          ? params['showOnlyOwned'] === 'true'
          : this.filters.showOnlyOwned,
        colors: params['colors']
          ? Array.isArray(params['colors'])
            ? params['colors']
            : [params['colors']]
          : this.filters.colors,
        sets: params['sets']
          ? Array.isArray(params['sets'])
            ? params['sets']
            : [params['sets']]
          : this.filters.sets,
        rarities: params['rarities']
          ? Array.isArray(params['rarities'])
            ? params['rarities']
            : [params['rarities']]
          : this.filters.rarities,
        power: params['power']
          ? Array.isArray(params['power'])
            ? params['power'].map((power) => typeof power === 'string' ? parseInt(power, 10) : power)
            : [params['power']]
          : this.filters.power,
        costs: params['costs']
          ? Array.isArray(params['costs'])
            ? params['costs'].map((cost) => typeof cost === 'string' ? parseInt(cost, 10) : cost)
            : [params['costs']]
          : this.filters.costs
      };

      await Promise.all([
        this._loadCards(),
        this._loadFilters()
      ]);
    });
  }

  private async _loadFilters() {
    try {
      const [colors, sets, rarities] = await Promise.all([
        this._cardsListService.getCardColors(),
        this._setsService.getSetsList(),
        this._cardsListService.getCardRarities(),
      ]);

      this.cardColors = colors;
      this.cardSets = sets;
      this.cardRarities = rarities;
    } catch (error) {
      this._onFiltersLoadError(error);
    }
  }

  private _onFiltersLoadError(error: any) {
    console.log(error);
    // TODO: handle error
  }

  private async _loadCards() {
    if (this.isLoadingInProgress || (this._cardsTotalCount !== null && this._cardsTotalCount === this.cards.length)) {
      return;
    }

    this.isLoadingInProgress = true;

    try {
      const {data, count} = await this._cardsListService.getCardsList({
        pageSize: this.cardsPerPage,
        page: this._page
      }, this.filters);

      this._page++;
      this._cardsTotalCount = count;

      this._onCardsListLoadSuccess(data);
    } catch (error) {
      this._onCardsListLoadError(error);
    }
  }

  private _onCardsListLoadSuccess(
    cards: CardModel[]
  ) {
    this.cards.push(...cards
      .map((card) => {
        return {
          card,
          quantity: card.inventoryQuantity ?? 0
        };
      }));
    this.isLoadingInProgress = false;
  }

  private _onCardsListLoadError(error: any) {
    this.isLoadingInProgress = false;
    console.log(error);
    // TODO: handle error
  }

  public async onNearEndScroll() {
    await this._loadCards();
  }

  private _resetLocalCardsPagination() {
    this.cards = [];
    this._page = 0;
    this._cardsTotalCount = null;
  }

  private async _updateFiltersQueryParams() {
    await this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        sets: this.filters.sets && this.filters.sets.length > 0 ? this.filters.sets : undefined,
        colors: this.filters.colors && this.filters.colors.length > 0 ? this.filters.colors : undefined,
        rarities: this.filters.rarities && this.filters.rarities.length > 0 ? this.filters.rarities : undefined,
        searchText: this.filters.searchText && this.filters.searchText !== '' && this.filters.searchText !== undefined && this.filters.searchText !== null ? this.filters.searchText : undefined,
        showOnlyOwned: this.filters.showOnlyOwned !== undefined ? this.filters.showOnlyOwned : undefined,
        power: this.filters.power && this.filters.power.length === 2 && (this.filters.power[0] !== MIN_POWER || this.filters.power[1] !== MAX_POWER) ? this.filters.power : undefined,
        costs: this.filters.costs && this.filters.costs.length === 2 && (this.filters.costs[0] !== MIN_POWER || this.filters.costs[1] !== MAX_POWER) ? this.filters.costs : undefined
      }
    });
  }

  public async onFiltersApply(filters: CardFilters) {
    this._resetLocalCardsPagination();
    this.filters = filters;
    await this._updateFiltersQueryParams();
    await this._loadCards();
  }

  private async _updateCardInventory(card: CardPreviewModel) {
    try {
      const inventory = await this._inventoryService.upsertInventory(card.card, card.quantity);

      card.card.inventoryId = inventory[0].id;
      card.card.inventoryQuantity = inventory[0].quantity;
    } catch (error) {
      // TODO show error message
      // card.quantity--;
      console.log(error);
    }
  }

  public async onPlusClick(card: CardPreviewModel) {
    card.quantity++;
    await this._updateCardInventory(card);
  }

  public async onQuantityChange(quantity: number | null, card: CardPreviewModel) {
    card.quantity = quantity ?? 0;
    await this._updateCardInventory(card);
  }

  public async onMinusClick(card: CardPreviewModel) {
    if (card.quantity <= 0) {
      return;
    }

    card.quantity--;
    await this._updateCardInventory(card);
  }

  public canDecreaseQuantity(card: CardPreviewModel): boolean {
    return card.quantity > 0;
  }

  public getAppliedFiltersForChips(): FilterChip[] {
    const filters: FilterChip[] = [];
    if (this.filters.searchText !== '' && this.filters.searchText !== undefined && this.filters.searchText !== null) {
      filters.push({
        id: uuidv4(),
        label: this._translateService.translate('cards.filters.search', {searchText: this.filters.searchText}),
        type: 'searchText'
      });
    }
    if (this.filters.colors && this.filters.colors.length > 0) {
      filters.push(...this.filters.colors.map((color) => {
        const translatedColor = this._translateService.translate(`cards.colors.${this._stringManipulationService.toCamelCase(color)}`);

        return {
          id: uuidv4(),
          label: this._translateService.translate('cards.filters.color', {color: translatedColor}),
          type: "colors" as FilterType,
          value: color
        }
      }));
    }
    if (this.filters.sets && this.filters.sets.length > 0) {
      filters.push(...this.filters.sets.map((setId) => {
        const setName = this.cardSets.find((cardSet) => cardSet.id === setId)?.name ?? "-";

        return {
          id: uuidv4(),
          label: this._translateService.translate('cards.filters.set', {set: setName}),
          type: 'sets' as FilterType,
          value: setId
        }
      }));
    }
    if (this.filters.rarities && this.filters.rarities.length > 0) {
      filters.push(...this.filters.rarities.map((rarity) => {
        const translatedRarity = this._translateService.translate(`cards.rarities.${this._stringManipulationService.toCamelCase(rarity)}`);

        return {
          id: uuidv4(),
          label: this._translateService.translate('cards.filters.rarity', {rarity: translatedRarity}),
          type: 'rarities' as FilterType,
          value: rarity
        }
      }));
    }
    if (this.filters.power && this.filters.power.length === 2 && (this.filters.power[0] !== MIN_POWER || this.filters.power[1] !== MAX_POWER)) {
      filters.push({
        id: uuidv4(),
        label: this._translateService.translate('cards.filters.power', {
          min: this.filters.power[0],
          max: this.filters.power[1]
        }),
        type: 'power',
      });

    }
    if (this.filters.costs && this.filters.costs.length === 2 && (this.filters.costs[0] !== MIN_COST || this.filters.costs[1] !== MAX_COST)) {
      filters.push({
        id: uuidv4(),
        label: this._translateService.translate('cards.filters.cost', {
          min: this.filters.costs[0],
          max: this.filters.costs[1]
        }),
        type: 'costs',
      });
    }
    if (this.filters.showOnlyOwned) {
      filters.push({
        id: uuidv4(),
        label: this._translateService.translate('cards.filters.onlyOwned'),
        type: 'showOnlyOwned'
      });
    }
    return filters;
  }

  public async onFilterChipRemoveClick(filter: FilterChip) {
    switch (filter.type) {
      case 'searchText':
        this.filters.searchText = '';
        break;
      case 'colors':
        this.filters.colors = this.filters.colors!.filter((color) => color !== filter.value);
        break;
      case 'sets':
        this.filters.sets = this.filters.sets!.filter((setId) => setId !== filter.value);
        break;
      case 'rarities':
        this.filters.rarities = this.filters.rarities!.filter((rarity) => rarity !== filter.value);
        break;
      case 'power':
        this.filters.power = [MIN_POWER, MAX_POWER];
        break;
      case 'costs':
        this.filters.costs = [MIN_COST, MAX_COST];
        break;
      case 'showOnlyOwned':
        this.filters.showOnlyOwned = false;
        break;
    }
    this._resetLocalCardsPagination();
    await this._updateFiltersQueryParams();
  }
}
