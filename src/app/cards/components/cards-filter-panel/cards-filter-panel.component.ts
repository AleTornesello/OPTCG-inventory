import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {faChevronUp, faFilter} from "@fortawesome/free-solid-svg-icons";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {CheckboxComponent} from "../../../shared/components/inputs/checkbox/checkbox.component";
import {DropdownComponent} from "../../../shared/components/inputs/dropdown/dropdown.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {TranslocoPipe, TranslocoService} from "@jsverse/transloco";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SelectItem} from "primeng/api";
import {MAX_COST, MAX_POWER, MIN_COST, MIN_POWER} from "../../models/card.model";
import {CardsService} from "../../services/cards.service";
import {SetsService} from "../../services/sets.service";
import {SetModel} from "../../models/set.model";
import {StringManipulationService} from "../../../shared/services/string-manipulation.service";

export interface CardFilters {
  searchText?: string;
  colors?: string[];
  sets?: string[];
  rarities?: string[];
  showOnlyOwned?: boolean;
  power?: number[];
  costs?: number[];
}

@Component({
  selector: 'app-cards-filter-panel',
  standalone: true,
  imports: [
    ButtonComponent,
    CheckboxComponent,
    DropdownComponent,
    FaIconComponent,
    InputTextComponent,
    TranslocoPipe,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './cards-filter-panel.component.html',
  styleUrl: './cards-filter-panel.component.scss'
})
export class CardsFilterPanelComponent {

  @ViewChild('filtersButton') filtersButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('filtersPanel') filtersPanel?: ElementRef<HTMLDivElement>;

  @Input() set filters(filters: CardFilters) {
    this.form.patchValue(filters);
  }
  @Input() set colors(colors: string[]) {
    this._initCardColorsFilter(colors);
  }
  @Input() set sets(sets: SetModel[]) {
    this._initCardSetsFilter(sets);
  }
  @Input() set rarities(rarities: string[]) {
    this._initCardRaritiesFilter(rarities);
  }

  @Output() apply: EventEmitter<CardFilters>;

  public form: FormGroup;

  protected cardColors: SelectItem[];
  protected cardSets: SelectItem[];
  protected cardRarities: SelectItem[];

  protected readonly faChevronUp = faChevronUp;
  protected readonly faFilter = faFilter;

  constructor(
    private _fb: FormBuilder,
    private _translateService: TranslocoService,
    private _stringManipulationService: StringManipulationService
  ) {
    this.apply = new EventEmitter();

    this.form = this._buildForm();

    this.cardColors = [];
    this.cardSets = [];
    this.cardRarities = [];
  }

  private _buildForm() {
    return this._fb.group({
      searchText: [''],
      colors: [[]],
      sets: [[]],
      rarities: [[]],
      showOnlyOwned: [false],
      // power: [[MIN_POWER, MAX_POWER]],
      // costs: [[MIN_COST, MAX_COST]]
    });
  }

  public onFiltersClick() {
    this.filtersButton?.nativeElement.classList.toggle('active');
    this.filtersPanel?.nativeElement.classList.toggle('active');
  }

  public async onFiltersApplyClick() {
    this._emitCurrentFilters();
  }

  public async onFiltersClearClick() {
    this.form.reset();
    this._emitCurrentFilters();
  }

  private _emitCurrentFilters() {
    this.apply.emit({
      searchText: this.form.get('searchText')!.value ?? "",
      colors: this.form.get('colors')!.value ?? [],
      sets: this.form.get('sets')!.value ?? [],
      rarities: this.form.get('rarities')!.value ?? [],
      showOnlyOwned: this.form.get('showOnlyOwned')!.value ?? false,
      power: [MIN_POWER, MAX_POWER],
      costs: [MIN_COST, MAX_COST]
    });
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
        label: this._translateService.translate(`cards.rarities.${this._stringManipulationService.toCamelCase(rarity)}`),
        value: rarity
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
}
