import {Injectable} from '@angular/core';
import {SupabaseService} from "../../shared/services/supabase.service";
import {SetEntity} from "../entities/set.entity";
import {SetMapper} from "../mappers/set.mapper";
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
}
