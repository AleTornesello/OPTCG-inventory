import {Injectable} from '@angular/core';
import {SupabaseService} from "../../shared/services/supabase.service";
import {CardEntity} from "../entities/card.entity";
import {CardMapper} from "../mappers/card.mapper";
import {QueryParserService} from "../../shared/services/query-parser.service";
import {MAX_COST, MAX_POWER, MIN_COST, MIN_POWER} from "../models/card.model";
import {CardPropertiesService} from "./card_properties.service";
import {CardPropertyEntity} from "../entities/card_property.entity";

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor(
    private _supabaseService: SupabaseService,
    private _queryParserService: QueryParserService,
    private _cardPropertiesService: CardPropertiesService
  ) {
  }

  public async getCardsList(pagination?: { page: number, pageSize: number }, filters?: {
    searchText?: string,
    colors?: string[],
    sets?: string[],
    rarities?: string[],
    showOnlyOwned?: boolean,
    power?: number[]
    costs?: number[]
  }, ignoreProperties: boolean = false) {
    let selectColumns = "id, code, name, image_url, set:set_id(*)";

    if (!ignoreProperties) {
      selectColumns = `${selectColumns}, properties:card_properties!inner(key, value)`
    }

    selectColumns = `${selectColumns}${filters?.showOnlyOwned
      ? ", inventory!inner(*)"
      : ", inventory(*)"}`;

    let query = this._supabaseService.supabase
      .from('cards')
      .select(selectColumns, {count: "exact"})
      .order("code", {ascending: true, referencedTable: "set"})
      .order("code", {ascending: true});

    if (pagination) {
      query = query.range(pagination.page * pagination.pageSize, ((pagination.page + 1) * pagination.pageSize) - 1);
    }

    if (filters) {
      if (filters.colors && filters.colors.length > 0) {
        query = query
          .or(filters.colors
              .map((color) => `and(key.eq.color, value.eq.${color})`)
              .join(', '),
            {referencedTable: 'properties'}
          )
      }

      if (filters.sets && filters.sets.length > 0) {
        query = query
          .in('set_id', filters.sets);
      }

      if (filters.searchText && filters.searchText !== '') {
        query = query.textSearch(
          'search_text',
          this._queryParserService.parse(filters.searchText)
        );
      }

      if (filters.rarities && filters.rarities.length > 0) {
        query = query
          .or(filters.rarities
              .map((rarity) => `and(key.eq.rarity, value.eq.${rarity})`)
              .join(', '),
            {referencedTable: 'properties'}
          )
      }

      if (filters.showOnlyOwned) {
        query = query
          .gt('inventory.quantity', 0);
      }

      if (filters.power && filters.power.length === 2 && (filters.power[0] !== MIN_POWER || filters.power[1] !== MAX_POWER)) {
        query = query
          .gte('power', filters.power[0])
          .lte('power', filters.power[1]);
      }

      if (filters.costs && filters.costs.length === 2 && (filters.costs[0] !== MIN_COST || filters.costs[1] !== MAX_COST)) {
        query = query
          .gte('cost', filters.costs[0])
          .lte('cost', filters.costs[1]);
      }
    }

    const {data, error, count} = await query.returns<CardEntity[]>();

    // Workaround: reload card properties because the search query
    // return only the properties that match the filters
    let properties: Map<string, CardPropertyEntity[]> = new Map();
    if (!ignoreProperties && data) {
      properties = new Map((await Promise.all(data.map((card) => this._cardPropertiesService.getCardPropertiesByCardId(card.id)))).map((p) => [p[0].card_id, p]));
    }

    if (error) {
      throw error;
    }

    return {
      data: data.map((card) => CardMapper.toCardModel({
        ...card,
        properties: properties.get(card.id) ?? []
      })), count
    };
  }

  public async getCardColors() {
    const {data, error} = await this._supabaseService.supabase
      .rpc('get_card_colors')
      .returns<string[]>();

    if (error) {
      throw error;
    }

    return data;
  }

  public async getCardRarities() {
    const {data, error} = await this._supabaseService.supabase
      .rpc('get_card_rarities')
      .returns<string[]>();

    if (error) {
      throw error;
    }

    return data;
  }

  public async getCardCosts() {
    const {data, error} = await this._supabaseService.supabase
      .rpc('get_card_costs')
      .returns<number[]>();

    if (error) {
      throw error;
    }

    return data;
  }

  public async getCardMinPower() {
    const {data, error} = await this._supabaseService.supabase
      .rpc('get_card_min_power')
      .returns<number>();

    if (error) {
      throw error;
    }

    return data;
  }

  public async getCardMaxPower() {
    const {data, error} = await this._supabaseService.supabase
      .rpc('get_card_max_power')
      .returns<number>();

    if (error) {
      throw error;
    }

    return data;
  }
}
