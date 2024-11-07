import {Injectable} from '@angular/core';
import {SupabaseService} from "../../shared/services/supabase.service";
import {InventoryEntity} from "../entities/inventory.entity";
import {CardModel} from "../models/card.model";
import {InventoryMapper} from "../mappers/inventory.mapper";

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(
    private _supabaseService: SupabaseService,
  ) {
  }

  public async upsertInventory(card: CardModel, quantity: number) {
    let query = this._supabaseService.supabase
      .from('inventory')
      .upsert(
        {id: card.inventoryId ?? undefined, quantity, card_id: card.id},
        {
          onConflict: 'id',
          ignoreDuplicates: false
        })
      .select();

    const {data, error} = await query.returns<InventoryEntity[]>();

    if (error) {
      throw error;
    }

    return data.map((inventory) => InventoryMapper.toInventoryModel(inventory));
  }
}
