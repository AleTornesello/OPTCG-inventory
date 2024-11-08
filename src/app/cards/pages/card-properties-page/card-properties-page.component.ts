import {Component, OnInit} from '@angular/core';
import {CardFilters, CardsFilterPanelComponent} from "../../components/cards-filter-panel/cards-filter-panel.component";
import {SetModel} from "../../models/set.model";
import {ActivatedRoute, Router} from "@angular/router";
import {CardModel, MAX_POWER, MIN_POWER} from "../../models/card.model";
import {CardsService} from "../../services/cards.service";
import {SetsService} from "../../services/sets.service";
import {GenericTableComponent} from "../../../shared/components/table/generic-table/generic-table.component";
import {GenericTableColumn} from "../../../shared/models/table";
import {TranslocoService} from "@jsverse/transloco";
import {TableCellDirective} from "../../../shared/directives/table-cell.directive";
import {CheckboxComponent} from "../../../shared/components/inputs/checkbox/checkbox.component";
import {ImageModule} from "primeng/image";
import {CardPropertiesService} from "../../services/card_properties.service";

@Component({
  selector: 'app-card-properties-page',
  standalone: true,
  imports: [
    CardsFilterPanelComponent,
    GenericTableComponent,
    TableCellDirective,
    CheckboxComponent,
    ImageModule
  ],
  templateUrl: './card-properties-page.component.html',
  styleUrl: './card-properties-page.component.scss'
})
export class CardPropertiesPageComponent implements OnInit {

  public cards: CardModel[];
  public cardColors: string[];
  public cardSets: SetModel[];
  public cardRarities: string[];
  public filters: CardFilters;
  public isLoadingInProgress: boolean;
  public cardsTotalCount: number | null;

  public columns: GenericTableColumn[];

  private _page: number;
  private readonly _cardsPerPage: number;

  constructor(
    private _route: ActivatedRoute,
    private _cardsListService: CardsService,
    private _setsService: SetsService,
    private _router: Router,
    private _translateService: TranslocoService,
    private _cardPropertyService: CardPropertiesService
  ) {
    this.filters = {
      searchText: '',
      colors: [],
      sets: [],
      rarities: [],
      showOnlyOwned: false
    };
    this.cards = [];
    this.cardColors = [];
    this.cardSets = [];
    this.cardRarities = [];
    this.isLoadingInProgress = false;
    this.cardsTotalCount = null;
    this._page = 0;
    this._cardsPerPage = 20;
    this.columns = [
      {
        header: "",
        field: 'image',
      },
      {
        header: this._translateService.translate('cards.name'),
        field: 'name',
      },
      {
        header: this._translateService.translate('cards.foil'),
        field: 'foil',
      },
      {
        header: this._translateService.translate('cards.alternateArt'),
        field: 'alternateArt',
      },
      {
        header: this._translateService.translate('cards.mangaArt'),
        field: 'mangaArt',
      }
    ];
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

  private async _loadCards() {
    if (this.isLoadingInProgress || (this.cardsTotalCount !== null && this.cardsTotalCount === this.cards.length)) {
      return;
    }

    this.isLoadingInProgress = true;

    try {
      const {data, count} = await this._cardsListService.getCardsList({
        pageSize: this._cardsPerPage,
        page: this._page
      }, this.filters);

      this._page++;
      this.cardsTotalCount = count;

      this._onCardsListLoadSuccess(data);
    } catch (error) {
      this._onCardsListLoadError(error);
    }
  }

  private _onCardsListLoadSuccess(
    cards: CardModel[]
  ) {
    this.cards = cards;
    this.isLoadingInProgress = false;
  }

  private _onCardsListLoadError(error: any) {
    this.isLoadingInProgress = false;
    console.log(error);
    // TODO: handle error
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

  public async onFiltersApply(filters: CardFilters) {
    this._resetLocalCardsPagination();
    this.filters = filters;
    await this._updateFiltersQueryParams();
    await this._loadCards();
  }

  private _resetLocalCardsPagination() {
    this.cards = [];
    this._page = 0;
    this.cardsTotalCount = null;
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

  public async onFoilPropertyChange(card: CardModel, value: any) {
    await this._onPropertyChange(card.foilPropertyId, 'foil', value, card.id)
  }

  public async onAlternateArtPropertyChange(card: CardModel, value: any) {
    await this._onPropertyChange(card.alternateArtPropertyId, 'alternate_art', value, card.id)
  }

  public async onMangaArtPropertyChange(card: CardModel, value: any) {
    await this._onPropertyChange(card.mangaArtPropertyId, 'manga_art', value, card.id)
  }

  private async _onPropertyChange(id: string | null, key: string, value: any, cardId: string) {
    try {
      const updatedCardProperty = await this._cardPropertyService.upsertCardProperty(
        id,
        key,
        value,
        cardId,
      );

      if(updatedCardProperty.length > 0) {
        const card = this.cards.find((card) => card.id === cardId);

        if(card) {
          switch (key) {
            case 'foil':
              card.foilPropertyId = updatedCardProperty[0].id;
              break;
            case 'alternate_art':
              card.alternateArtPropertyId = updatedCardProperty[0].id;
              break;
            case 'manga_art':
              card.mangaArtPropertyId = updatedCardProperty[0].id;
              break;
          }
        }
      }
    } catch (error) {
      // TODO: handle error
      console.log(error);
    }
  }
}
