import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CardsService} from "../../services/cards.service";
import {CardModel, MAX_COST, MAX_POWER, MIN_COST, MIN_POWER} from "../../models/card.model";
import {CardPreviewComponent, CardPreviewModel} from "../../components/card-preview/card-preview.component";
import {ScrollNearEndDirective} from "../../../shared/directives/scroll-near-end.directive";
import {AccordionModule} from "primeng/accordion";
import {TranslocoPipe, TranslocoService} from "@jsverse/transloco";
import {faChevronUp, faFilter, faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {DropdownComponent} from "../../../shared/components/inputs/dropdown/dropdown.component";
import {SelectItem} from "primeng/api";
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
import {SkeletonModule} from "primeng/skeleton";
import {ChipModule} from "primeng/chip";
import { v4 as uuidv4 } from 'uuid';
import {ChipComponent} from "../../../shared/components/chip/chip.component";

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
    SkeletonModule,
    ChipModule,
    ChipComponent,
  ],
  templateUrl: './cards-grid-page.component.html',
  styleUrl: './cards-grid-page.component.scss'
})
export class CardsGridPageComponent implements OnInit {

  @ViewChild('filtersButton') filtersButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('filtersPanel') filtersPanel?: ElementRef<HTMLDivElement>;

  public cards: CardPreviewModel[];
  public cardColors: SelectItem[];
  public cardSets: SelectItem[];
  public cardRarities: SelectItem[];

  public selectedColors: string[];
  public selectedSets: string[];
  public selectedRarities: string[];
  public searchText: string;
  public showOnlyOwnedFilter: boolean;
  public selectedPower: number[];
  public selectedCosts: number[];

  public appliedSelectedColors: string[];
  public appliedSelectedSets: string[];
  public appliedSelectedRarities: string[];
  public appliedSearchText: string;
  public appliedShowOnlyOwnedFilter: boolean;
  public appliedSelectedPower: number[];
  public appliedSelectedCosts: number[];

  public isLoadingInProgress: boolean;

  protected readonly faFilter = faFilter;
  protected readonly faChevronUp = faChevronUp;
  protected readonly faPlus = faPlus;
  protected readonly faMinus = faMinus;

  private _page: number;
  private readonly _cardsPerPage: number;
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
    this._page = 0;
    this._cardsPerPage = 20;
    this.cardColors = [];
    this.cardSets = [];
    this.selectedColors = [];
    this.selectedSets = [];
    this.isLoadingInProgress = false;
    this._cardsTotalCount = null;
    this.searchText = '';
    this.cardRarities = [];
    this.selectedRarities = [];
    this.showOnlyOwnedFilter = false;
    this.selectedPower = [MIN_POWER, MAX_POWER];
    this.selectedCosts = [MIN_COST, MAX_COST];

    this.appliedSelectedColors = this.selectedColors;
    this.appliedSelectedSets = this.selectedSets;
    this.appliedSelectedRarities = this.selectedRarities;
    this.appliedSearchText = this.searchText;
    this.appliedShowOnlyOwnedFilter = this.showOnlyOwnedFilter;
    this.appliedSelectedPower = [...this.selectedPower];
    this.appliedSelectedCosts = [...this.selectedCosts];
  }

  public ngOnInit() {
    this._route.queryParams.subscribe(async (params) => {
      this.searchText = params['searchText'] ?? '';
      this.appliedSearchText = this.searchText;

      this.selectedColors = params['colors']
        ? Array.isArray(params['colors'])
          ? params['colors']
          : [params['colors']]
        : [];
      this.appliedSelectedColors = this.selectedColors;

      this.selectedSets = params['sets']
        ? Array.isArray(params['sets'])
          ? params['sets']
          : [params['sets']]
        : [];
      this.appliedSelectedSets = this.selectedSets;

      this.selectedRarities = params['rarities']
        ? Array.isArray(params['rarities'])
          ? params['rarities']
          : [params['rarities']]
        : [];
      this.appliedSelectedRarities = this.selectedRarities;

      this.showOnlyOwnedFilter = params['showOnlyOwned'] !== null && params['showOnlyOwned'] !== undefined
        ? params['showOnlyOwned'] === 'true'
        : false;
      this.appliedShowOnlyOwnedFilter = this.showOnlyOwnedFilter;

      this.selectedPower = params['power']
        ? Array.isArray(params['power'])
          ? params['power'].map((power) => typeof power === 'string' ? parseInt(power, 10) : power)
          : [params['power']]
        : [MIN_POWER, MAX_POWER];
      this.appliedSelectedPower = [...this.selectedPower];

      this.selectedCosts = params['costs']
        ? Array.isArray(params['costs'])
          ? params['costs'].map((cost) => typeof cost === 'string' ? parseInt(cost, 10) : cost)
          : [params['costs']]
        : [MIN_COST, MAX_COST];
      this.appliedSelectedCosts = [...this.selectedCosts];

      await Promise.all([
        this._loadCards(),
        this._loadFilters()
      ]);
    });
  }

  private async _loadCards() {
    if (this.isLoadingInProgress || (this._cardsTotalCount !== null && this._cardsTotalCount === this.cards.length)) {
      return;
    }

    this.isLoadingInProgress = true;

    try {
      const {data, count} = await this._cardsListService.getCardsList({
        pageSize: this._cardsPerPage,
        page: this._page
      }, {
        searchText: this.appliedSearchText,
        colors: this.appliedSelectedColors,
        sets: this.appliedSelectedSets,
        rarities: this.appliedSelectedRarities,
        showOnlyOwned: this.appliedShowOnlyOwnedFilter,
        power: this.appliedSelectedPower,
        costs: this.appliedSelectedCosts
      });

      this._page++;
      this._cardsTotalCount = count;

      this._onCardsListLoadSuccess(data);
    } catch (error) {
      this._onCardsListLoadError(error);
    }
  }

  private async _loadFilters() {
    try {
      const [colors, sets, rarities] = await Promise.all([
        this._cardsListService.getCardColors(),
        this._setsService.getSetsList(),
        this._cardsListService.getCardRarities(),
      ]);

      this._initFilterOptions(colors, sets, rarities);
    } catch (error) {
      this._onFiltersLoadError(error);
    }
  }

  private _onCardsListLoadSuccess(
    cards: CardModel[]
  ) {
    this.cards.push(...cards
      .map((card) => {
        return {
          card,
          quantity: card.inventory?.quantity ?? 0
        };
      }));
    this.isLoadingInProgress = false;
  }

  private _initFilterOptions(colors: string[], sets: SetModel[], rarities: string[]) {
    this._initCardColorsFilter(colors);
    this._initCardSetsFilter(sets);
    this._initCardRaritiesFilter(rarities);
  }

  private _initCardColorsFilter(colors: string[]) {
    this.cardColors = colors
      .map((color) => ({
        label: this._translateService.translate(`cards.colors.${color.toLowerCase()}`),
        value: color
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private _initCardSetsFilter(sets: SetModel[]) {
    this.cardSets = sets
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((set) => ({
        label: set.name,
        value: set.id
      }));
  }

  private _initCardRaritiesFilter(rarities: string[]) {
    this.cardRarities = rarities
      .map((rarity) => ({
        label: this._translateService.translate(`cards.rarities.${this._stringManipulationService.toSnakeCase(rarity)}`),
        value: rarity
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private _onCardsListLoadError(error: any) {
    this.isLoadingInProgress = false;
    console.log(error);
    // TODO: handle error
  }

  private _onFiltersLoadError(error: any) {
    console.log(error);
    // TODO: handle error
  }

  public async onNearEndScroll() {
    await this._loadCards();
  }

  public onFiltersClick() {
    this.filtersButton?.nativeElement.classList.toggle('active');
    this.filtersPanel?.nativeElement.classList.toggle('active');
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
        sets: this.appliedSelectedSets.length > 0 ? this.appliedSelectedSets : undefined,
        colors: this.appliedSelectedColors.length > 0 ? this.appliedSelectedColors : undefined,
        rarities: this.appliedSelectedRarities.length > 0 ? this.appliedSelectedRarities : undefined,
        searchText: this.appliedSearchText !== '' && this.appliedSearchText !== undefined && this.appliedSearchText !== null ? this.appliedSearchText : undefined,
        showOnlyOwned: this.appliedShowOnlyOwnedFilter ? this.appliedShowOnlyOwnedFilter : undefined,
        power: this.appliedSelectedPower.length === 2 && (this.appliedSelectedPower[0] !== MIN_POWER || this.appliedSelectedPower[1] !== MAX_POWER) ? this.appliedSelectedPower : undefined,
        costs: this.appliedSelectedCosts.length === 2 && (this.appliedSelectedCosts[0] !== MIN_POWER || this.appliedSelectedCosts[1] !== MAX_POWER) ? this.appliedSelectedCosts : undefined
      }
    });
  }

  public async onFiltersApplyClick() {
    this._resetLocalCardsPagination();
    this.appliedSearchText = this.searchText;
    this.appliedSelectedColors = this.selectedColors;
    this.appliedSelectedSets = this.selectedSets;
    this.appliedSelectedRarities = this.selectedRarities;
    this.appliedShowOnlyOwnedFilter = this.showOnlyOwnedFilter;
    this.appliedSelectedPower = [...this.selectedPower];
    this.appliedSelectedCosts = [...this.selectedCosts];
    await this._updateFiltersQueryParams();
    await this._loadCards();
  }

  public async onFiltersClearClick() {
    this.selectedColors = [];
    this.selectedSets = [];
    this.selectedRarities = [];
    this.cards = [];
    this._page = 0;
    this._cardsTotalCount = null;
    this.searchText = '';
    this.showOnlyOwnedFilter = false;
    this.selectedPower = [MIN_POWER, MAX_POWER];
    this.selectedCosts = [MIN_COST, MAX_COST];
    await this._router.navigate([], {
      relativeTo: this._route
    })
    await this._loadCards();
  }

  public async onQuantityIncrease(card: CardPreviewModel) {
    try {
      const inventory = await this._inventoryService.upsertInventory(card.card, card.quantity);

      card.card.inventory = inventory[0];
    } catch (error) {
      // TODO show error message
      // card.quantity--;
      console.log(error);
    }
  }

  public async onQuantityDecrease(card: CardPreviewModel) {
    try {
      const inventory = await this._inventoryService.upsertInventory(card.card, card.quantity);

      card.card.inventory = inventory[0];
    } catch (error) {
      // TODO show error message
      // card.quantity++;
      console.log(error);
    }
  }

  public async onPlusClick(card: CardPreviewModel) {
    card.quantity++;
    await this.onQuantityIncrease(card);
  }

  public async onMinusClick(card: CardPreviewModel) {
    if (card.quantity <= 0) {
      return;
    }

    card.quantity--;
    await this.onQuantityDecrease(card);
  }

  public canDecreaseQuantity(card: CardPreviewModel): boolean {
    return card.quantity > 0;
  }

  public getAppliedFiltersForChips(): FilterChip[] {
    const filters: FilterChip[] = [];
    if (this.appliedSearchText !== '' && this.appliedSearchText !== undefined && this.appliedSearchText !== null) {
      filters.push({
        id: uuidv4(),
        label: this._translateService.translate('cards.filters.search', {searchText: this.appliedSearchText}),
        type: 'searchText'
      });
    }
    if (this.appliedSelectedColors.length > 0) {
      filters.push(...this.appliedSelectedColors.map((color) => {
        const translatedColor = this._translateService.translate(`cards.colors.${this._stringManipulationService.toSnakeCase(color)}`);

        return {
          id: uuidv4(),
          label: this._translateService.translate('cards.filters.color', {color: translatedColor}),
          type: "colors" as FilterType,
          value: color
        }
      }));
    }
    if (this.appliedSelectedSets.length > 0) {
      filters.push(...this.appliedSelectedSets.map((set) => {
        const setName = this.cardSets.find((cardSet) => cardSet.value === set)?.label;

        return {
          id: uuidv4(),
          label: this._translateService.translate('cards.filters.set', {set: setName}),
          type: 'sets' as FilterType,
          value: set
        }
      }));
    }
    if (this.appliedSelectedRarities.length > 0) {
      filters.push(...this.appliedSelectedRarities.map((rarity) => {
        const translatedRarity = this._translateService.translate(`cards.rarities.${this._stringManipulationService.toSnakeCase(rarity)}`);

        return {
          id: uuidv4(),
          label: this._translateService.translate('cards.filters.rarity', {rarity: translatedRarity}),
          type: 'rarities' as FilterType,
          value: rarity
        }
      }));
    }
    if (this.appliedSelectedPower.length === 2 && (this.appliedSelectedPower[0] !== MIN_POWER || this.appliedSelectedPower[1] !== MAX_POWER)) {
      filters.push({
        id: uuidv4(),
        label: this._translateService.translate('cards.filters.power', {
          min: this.appliedSelectedPower[0],
          max: this.appliedSelectedPower[1]
        }),
        type: 'power',
      });

    }
    if (this.appliedSelectedCosts.length === 2 && (this.appliedSelectedCosts[0] !== MIN_COST || this.appliedSelectedCosts[1] !== MAX_COST)) {
      filters.push({
        id: uuidv4(),
        label: this._translateService.translate('cards.filters.cost', {
          min: this.appliedSelectedCosts[0],
          max: this.appliedSelectedCosts[1]
        }),
        type: 'costs',
      });
    }
    if (this.appliedShowOnlyOwnedFilter) {
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
        this.searchText = '';
        this.appliedSearchText = '';
        break;
      case 'colors':
        this.selectedColors = this.selectedColors.filter((color) => color !== filter.value);
        this.appliedSelectedColors = this.appliedSelectedColors.filter((color) => color !== filter.value);
        break;
      case 'sets':
        this.selectedSets = this.selectedSets.filter((set) => set !== filter.value);
        this.appliedSelectedSets = this.appliedSelectedSets.filter((set) => set !== filter.value);
        break;
      case 'rarities':
        this.selectedRarities = this.selectedRarities.filter((rarity) => rarity !== filter.value);
        this.appliedSelectedRarities = this.appliedSelectedRarities.filter((rarity) => rarity !== filter.value);
        break;
      case 'power':
        this.selectedPower = [MIN_POWER, MAX_POWER];
        this.appliedSelectedPower = [MIN_POWER, MAX_POWER];
        break;
      case 'costs':
        this.selectedCosts = [MIN_COST, MAX_COST];
        this.appliedSelectedCosts = [MIN_COST, MAX_COST];
        break;
      case 'showOnlyOwned':
        this.showOnlyOwnedFilter = false;
        this.appliedShowOnlyOwnedFilter = false;
        break;
    }
    this._resetLocalCardsPagination();
    await this._updateFiltersQueryParams();
  }
}
