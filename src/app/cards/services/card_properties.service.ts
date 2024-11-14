import {Injectable} from '@angular/core';
import {SupabaseService} from "../../shared/services/supabase.service";
import {CardPropertyEntity} from "../entities/card_property.entity";
import {CardPropertyMapper} from "../mappers/card_property.mapper";

@Injectable({
  providedIn: 'root'
})
export class CardPropertiesService {

  constructor(
    private _supabaseService: SupabaseService,
  ) {
  }

  public async getCardPropertiesByCardId(cardId: string) {
    let query = this._supabaseService.supabase
      .from('card_properties')
      .select()
      .eq('card_id', cardId);

    const {data, error} = await query.returns<CardPropertyEntity[]>();

    if (error) {
      throw error;
    }

    return data;
  }

  public async upsertCardProperty(id: string | null, key: string, value: string, cardId: string) {
    let query = this._supabaseService.supabase
      .from('card_properties')
      .upsert(
        {id: id ?? undefined, key, value, card_id: cardId},
        {
          onConflict: 'id',
          ignoreDuplicates: false
        })
      .select();

    const {data, error} = await query.returns<CardPropertyEntity[]>();

    if (error) {
      throw error;
    }

    return data.map((property) => CardPropertyMapper.toCardPropertyModel(property));
  }
}
