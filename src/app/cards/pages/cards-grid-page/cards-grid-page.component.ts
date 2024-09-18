import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CardsService} from "../../services/cards.service";
import {CardModel} from "../../models/card.model";
import {CardPreviewComponent, CardPreviewModel} from "../../components/card-preview/card-preview.component";
import {ScrollNearEndDirective} from "../../../shared/directives/scroll-near-end.directive";
import {AccordionModule} from "primeng/accordion";
import {TranslocoPipe, TranslocoService} from "@jsverse/transloco";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {DropdownComponent} from "../../../shared/components/inputs/dropdown/dropdown.component";
import {SelectItem} from "primeng/api";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {FormsModule} from "@angular/forms";
import {SetsService} from "../../services/sets.service";
import {SetModel} from "../../models/set.model";
import {RingSpinnerComponent} from "../../../shared/components/ring-spinner/ring-spinner.component";
import {InventoryService} from "../../services/inventory.service";

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
    RingSpinnerComponent
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
  public isLoadingInProgress: boolean;

  protected readonly faFilter = faFilter;

  private _page: number;
  private readonly _cardsPerPage: number;

  constructor(
    private _cardsListService: CardsService,
    private _translateService: TranslocoService,
    private _setsService: SetsService,
    private _inventoryService: InventoryService
  ) {
    this.cards = [];
    this._page = 0;
    this._cardsPerPage = 20;
    this.cardColors = [];
    this.cardSets = [];
    this.selectedColors = [];
    this.selectedSets = [];
    this.isLoadingInProgress = false;
  }

  public async ngOnInit() {
    await Promise.all([
      this._loadCards(),
      this._loadFilters()
    ]);
  }

  private async _loadCards() {
    if (this.isLoadingInProgress) {
      return;
    }

    this.isLoadingInProgress = true;

    try {
      const cards = await this._cardsListService.getCardsList({
        pageSize: this._cardsPerPage,
        page: this._page
      }, {
        colors: this.selectedColors,
        sets: this.selectedSets
      });

      this._onCardsListLoadSuccess(cards);
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
    this._page++;
    await this._loadCards();
  }

  // private _loadNextCards() {
  // const filteredCards = this.allCards
  //   .filter((card) => {
  //     if (this.selectedColors.length > 0) {
  //       return card.color.some((color) => this.selectedColors.includes(color));
  //     }
  //
  //     return true;
  //   })
  //   .filter((card) => {
  //     if (this.selectedSets.length > 0) {
  //       return this.selectedSets.includes(card.cardId[0]);
  //     }
  //
  //     return true;
  //   });
  //
  // if (this.visibleCards.length >= filteredCards.length) {
  //   return;
  // }
  // const newCards = filteredCards
  //   .slice(this.visibleCards.length, this.visibleCards.length + this._cardsLoadRange)
  //   .map((card) => ({
  //     card,
  //     quantity: 0
  //   }));
  // this.visibleCards.push(...newCards);
  //
  // forkJoin(newCards.map((card) => this._cardsListService.getCardQuantity(card.card)))
  //   .pipe(takeUntilDestroyed(this._destroyRef))
  //   .subscribe({
  //     next: this._onCardsQuantityLoadSuccess.bind(this),
  //     error: this._onCardsQuantityLoadError.bind(this)
  //   });
  // }

  // private _onCardsQuantityLoadSuccess(quantities: (InventoryModel | null)[]) {
  //   quantities.forEach((inventory) => {
  //     if (inventory === null) {
  //       return;
  //     }
  //
  //     const card = this.visibleCards.find((card) => card.card.key === inventory?.key)!;
  //
  //     if (card === null || card === undefined) {
  //       return;
  //     }
  //
  //     card.quantity = inventory.quantity;
  //   });
  // }
  //
  // private _onCardsQuantityLoadError(error: any) {
  //   console.log(error)
  //   // TODO: handle error
  // }

  // public onCardQuantityChange(card: CardPreviewModel, newQuantity: number) {
  //   card.quantity = newQuantity;
  //
  //   this._cardsListService.updateCardQuantity(card.card, newQuantity)
  //     .pipe(takeUntilDestroyed(this._destroyRef))
  //     .subscribe({
  //       next: this._onCardQuantityUpdateSuccess.bind(this),
  //       error: this._onCardQuantityUpdateError.bind(this)
  //     });
  // }
  //
  // private _onCardQuantityUpdateSuccess() {
  //   // TODO: handle success
  // }
  //
  // private _onCardQuantityUpdateError(error: any) {
  //   console.log(error)
  //   // TODO: handle error
  // }

  public onFiltersClick() {
    this.filtersButton?.nativeElement.classList.toggle('active');
    this.filtersPanel?.nativeElement.classList.toggle('active');
  }

  public async onFiltersApplyClick() {
    this.cards = [];
    this._page = 0;
    await this._loadCards();
  }

  public async onFiltersClearClick() {
    this.selectedColors = [];
    this.selectedSets = [];
    this.cards = [];
    this._page = 0;
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
