import {Component, DestroyRef, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CardsService} from "../../services/cards.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CardModel} from "../../models/card.model";
import {CardPreviewComponent} from "../../components/card-preview/card-preview.component";
import {ScrollNearEndDirective} from "../../../shared/directives/scroll-near-end.directive";
import {forkJoin} from "rxjs";
import {InventoryModel} from "../../models/inventory.model";
import {AccordionModule} from "primeng/accordion";
import {TranslocoPipe, TranslocoService} from "@jsverse/transloco";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {DropdownComponent} from "../../../shared/components/inputs/dropdown/dropdown.component";
import {SelectItem} from "primeng/api";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {FormsModule} from "@angular/forms";

interface CardPreviewModel {
  card: CardModel;
  quantity: number;
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
    FormsModule
  ],
  templateUrl: './cards-grid-page.component.html',
  styleUrl: './cards-grid-page.component.scss'
})
export class CardsGridPageComponent implements OnInit {

  @ViewChild('filtersButton') filtersButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('filtersPanel') filtersPanel?: ElementRef<HTMLDivElement>;

  public visibleCards: CardPreviewModel[];
  public allCards: CardModel[];
  public cardColors: SelectItem[];
  public cardSets: SelectItem[];

  public selectedColors: string[];
  public selectedSets: string[];

  protected readonly faFilter = faFilter;

  private readonly _cardsLoadRange: number;

  constructor(
    private _cardsListService: CardsService,
    private _destroyRef: DestroyRef,
    private _translateService: TranslocoService
  ) {
    this.visibleCards = [];
    this.allCards = [];
    this._cardsLoadRange = 20;
    this.cardColors = [];
    this.cardSets = [];
    this.selectedColors = [];
    this.selectedSets = [];
  }

  public ngOnInit() {
    this._cardsListService.getCardsList()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this._onCardsListLoadSuccess.bind(this),
        error: this._onCardsListLoadError.bind(this)
      });
  }

  private _onCardsListLoadSuccess(cards: CardModel[]) {
    this.allCards = cards;
    this._initFilterOptions(this.allCards);
    this._loadNextCards();
  }

  private _initFilterOptions(cards: CardModel[]) {
    this._initCardColorsFilter(cards);
    this._initCardSetsFilter(cards);

  }

  private _initCardColorsFilter(cards: CardModel[]) {
    const colorsSet = new Set(cards.map((card) => card.color).flat());
    this.cardColors = Array.from(colorsSet)
      .map((color) => ({
        label: this._translateService.translate(`cards.colors.${color.toLowerCase()}`),
        value: color
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private _initCardSetsFilter(cards: CardModel[]) {
    const setsSet = new Set(cards.map((card) => card.cardId[0]).flat());
    this.cardSets = Array.from(setsSet)
      .sort((a, b) => a.localeCompare(b))
      .map((set) => ({
        label: set,
        value: set
      }));
  }

  private _onCardsListLoadError() {
    // TODO: handle error
  }

  public onNearEndScroll() {
    this._loadNextCards();
  }

  private _loadNextCards() {
    const filteredCards = this.allCards
      .filter((card) => {
        if (this.selectedColors.length > 0) {
          return card.color.some((color) => this.selectedColors.includes(color));
        }

        return true;
      })
      .filter((card) => {
        if (this.selectedSets.length > 0) {
          return this.selectedSets.includes(card.cardId[0]);
        }

        return true;
      });

    if (this.visibleCards.length >= filteredCards.length) {
      return;
    }
    const newCards = filteredCards
      .slice(this.visibleCards.length, this.visibleCards.length + this._cardsLoadRange)
      .map((card) => ({
        card,
        quantity: 0
      }));
    this.visibleCards.push(...newCards);

    forkJoin(newCards.map((card) => this._cardsListService.getCardQuantity(card.card)))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this._onCardsQuantityLoadSuccess.bind(this),
        error: this._onCardsQuantityLoadError.bind(this)
      });
  }

  private _onCardsQuantityLoadSuccess(quantities: (InventoryModel | null)[]) {
    quantities.forEach((inventory) => {
      if (inventory === null) {
        return;
      }

      const card = this.visibleCards.find((card) => card.card.key === inventory?.key)!;

      if (card === null || card === undefined) {
        return;
      }

      card.quantity = inventory.quantity;
    });
  }

  private _onCardsQuantityLoadError(error: any) {
    console.log(error)
    // TODO: handle error
  }

  public onCardQuantityChange(card: CardPreviewModel, newQuantity: number) {
    card.quantity = newQuantity;

    this._cardsListService.updateCardQuantity(card.card, newQuantity)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this._onCardQuantityUpdateSuccess.bind(this),
        error: this._onCardQuantityUpdateError.bind(this)
      });
  }

  private _onCardQuantityUpdateSuccess() {
    // TODO: handle success
  }

  private _onCardQuantityUpdateError(error: any) {
    console.log(error)
    // TODO: handle error
  }

  public onFiltersClick() {
    this.filtersButton?.nativeElement.classList.toggle('active');
    this.filtersPanel?.nativeElement.classList.toggle('active');
  }

  public onFiltersApplyClick() {
    this.visibleCards = [];
    this._loadNextCards();
  }

  public onFiltersClearClick() {
    this.selectedColors = [];
    this.selectedSets = [];
    this.visibleCards = [];
    this._loadNextCards();
  }
}
