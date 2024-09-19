import {Injectable} from '@angular/core';
import {SupabaseService} from "../../shared/services/supabase.service";
import {CardEntity} from "../entities/card.entity";
import {CardMapper} from "../mappers/card.mapper";
import {QueryParserService} from "../../shared/services/query-parser.service";

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor(
    private _supabaseService: SupabaseService,
    private _queryParserService: QueryParserService
  ) {
  }

  public async getCardsList(pagination?: { page: number, pageSize: number }, filters?: {
    searchText?: string,
    colors?: string[],
    sets?: string[],
    rarities?: string[]
  }) {
    let query = this._supabaseService.supabase
      .from('cards')
      .select("*, set:set_id(*), inventory(*)", {count: "exact"})
      .order("code", {ascending: true, referencedTable: "set"})
      .order("code", {ascending: true});

    if (pagination) {
      query = query.range(pagination.page * pagination.pageSize, ((pagination.page + 1) * pagination.pageSize) - 1);
    }

    if (filters) {
      if (filters.colors && filters.colors.length > 0) {
        query = query
          .or(filters.colors.map((color) => `color.cs.{${color}}`).join(', '));
      }

      if (filters.sets && filters.sets.length > 0) {
        query = query
          .in('set_id', filters.sets);
      }

      if (filters.searchText && filters.searchText !== '') {
        query = query.textSearch(
          'name',
          this._queryParserService.parse(filters.searchText)
        );
      }

      if (filters.rarities && filters.rarities.length > 0) {
        query = query
          .in('rarity', filters.rarities);
      }
    }

    const {data, error, count} = await query.returns<CardEntity[]>();

    if (error) {
      throw error;
    }

    return {data: data.map((card) => CardMapper.toCardModel(card)), count};
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
}
