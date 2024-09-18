import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CardsService} from "../../services/cards.service";
import {CardModel} from "../../models/card.model";
import {CardPreviewComponent, CardPreviewModel} from "../../components/card-preview/card-preview.component";
import {ScrollNearEndDirective} from "../../../shared/directives/scroll-near-end.directive";
import {AccordionModule} from "primeng/accordion";
import {TranslocoPipe, TranslocoService} from "@jsverse/transloco";
import {faChevronUp, faFilter} from "@fortawesome/free-solid-svg-icons";
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

  public selectedColors: string[];
  public selectedSets: string[];
  public searchText: string;
  public isLoadingInProgress: boolean;

  protected readonly faFilter = faFilter;
  protected readonly faChevronUp = faChevronUp;

  private _page: number;
  private readonly _cardsPerPage: number;
  private _cardsTotalCount: number | null;

  constructor(
    private _cardsListService: CardsService,
    private _translateService: TranslocoService,
    private _setsService: SetsService,
    private _inventoryService: InventoryService,
    private _router: Router,
    private _route: ActivatedRoute
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
  }

  public ngOnInit() {
    this._route.queryParams.subscribe(async (params) => {
      this.searchText = params['searchText'] ?? ''
      this.selectedColors = params['colors']
        ? Array.isArray(params['colors'])
          ? params['colors']
          : [params['colors']]
        : [];
      this.selectedSets = params['sets']
        ? Array.isArray(params['sets'])
          ? params['sets']
          : [params['sets']]
        : [];

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
        searchText: this.searchText,
        colors: this.selectedColors,
        sets: this.selectedSets
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
      const [colors, sets] = await Promise.all([
        this._cardsListService.getCardColors(),
        this._setsService.getSetsList()
      ])

      this._initFilterOptions(colors, sets);
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

  private _initFilterOptions(colors: string[], sets: SetModel[]) {
    this._initCardColorsFilter(colors);
    this._initCardSetsFilter(sets);

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

  public async onFiltersApplyClick() {
    this.cards = [];
    this._page = 0;
    this._cardsTotalCount = null;
    await this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        sets: this.selectedSets.length > 0 ? this.selectedSets : undefined,
        colors: this.selectedColors.length > 0 ? this.selectedColors : undefined,
        searchText: this.searchText
      }
    });
    await this._loadCards();
  }

  public async onFiltersClearClick() {
    this.selectedColors = [];
    this.selectedSets = [];
    this.cards = [];
    this._page = 0;
    this._cardsTotalCount = null;
    this.searchText = '';
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
}
