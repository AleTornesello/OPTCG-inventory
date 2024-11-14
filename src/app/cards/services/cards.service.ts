import {Injectable} from '@angular/core';
import {SupabaseService} from "../../shared/services/supabase.service";
import {CardEntity} from "../entities/card.entity";
import {CardMapper} from "../mappers/card.mapper";
import {QueryParserService} from "../../shared/services/query-parser.service";
import {CardFilters} from "../components/cards-filter-panel/cards-filter-panel.component";

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor(
    private _supabaseService: SupabaseService,
    private _queryParserService: QueryParserService,
  ) {
  }

  public async getCardsList(pagination?: { page: number, pageSize: number }, filters?: CardFilters) {
    let query = this._supabaseService.supabase
      .from('cards_view')
      .select("*", {count: "exact"});

    if (pagination) {
      query = query.range(pagination.page * pagination.pageSize, ((pagination.page + 1) * pagination.pageSize) - 1);
    }

    if (filters) {
      if (filters.colors && filters.colors.length > 0) {
        query = query.overlaps(
          'colors',
          filters.colors
        )
      }

      if (filters.sets && filters.sets.length > 0) {
        query = query
          .overlaps('set_ids', filters.sets);
      }

      if (filters.searchText && filters.searchText !== '') {
        query = query.textSearch(
          'search_text',
          this._queryParserService.parse(filters.searchText)
        );
      }

      if (filters.rarities && filters.rarities.length > 0) {
        query = query
          .in(
            'rarity',
            filters.rarities
          )
      }

      if (filters.showOnlyOwned) {
        query = query
          .gt('inventory_quantity', 0);
      }
      //
      //   if (filters.power && filters.power.length === 2 && (filters.power[0] !== MIN_POWER || filters.power[1] !== MAX_POWER)) {
      //     query = query
      //       .gte('power', filters.power[0])
      //       .lte('power', filters.power[1]);
      //   }
      //
      //   if (filters.costs && filters.costs.length === 2 && (filters.costs[0] !== MIN_COST || filters.costs[1] !== MAX_COST)) {
      //     query = query
      //       .gte('cost', filters.costs[0])
      //       .lte('cost', filters.costs[1]);
      //   }
    }
    //
    const {data, error, count} = await query.returns<CardEntity[]>();

    if (error) {
      throw error;
    }

    return {
      data: data?.map((card) => CardMapper.toCardModel({
        ...card,
      })) ?? [], count
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
