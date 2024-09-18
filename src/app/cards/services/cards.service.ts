import {Injectable} from '@angular/core';
import {SupabaseService} from "../../shared/services/supabase.service";
import {CardEntity} from "../entities/card.entity";
import {CardMapper} from "../mappers/card.mapper";

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor(
    private _supabaseService: SupabaseService,
  ) {
  }

  public async getCardsList(pagination?: { page: number, pageSize: number }, filters?: {
    colors?: string[],
    sets?: string[]
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

  // public getCardImageUrl(card: CardModel): string {
  //   return `https://deckbuilder.egmanevents.com/card_images/optcg/${card.key}.webp`;
  // }

  // public getCardQuantity(card: CardModel): Observable<InventoryModel | null> {
  //   const docRef = doc(this._firestore, 'inventory', card.key);
  //   const docSnap = getDoc(docRef);
  //   return from(docSnap)
  //     .pipe(
  //       map((doc) =>
  //         doc.exists()
  //           ? InventoryModel.fromFirestore(card.key, doc.data())
  //           : null
  //       )
  //     );
  // }

  // public updateCardQuantity(card: CardModel, quantity: number): Observable<void> {
  //   const docRef = doc(this._firestore, 'inventory', card.key);
  //   return from(setDoc(docRef, {quantity}, {merge: true}));
  // }

  // public async getCardsQuantities(cardIds: string[]) {
  //   const {data, error} = await this._supabaseService.supabase
  //     .from('inventory')
  //     .select()
  //     .returns<InventoryEntity[]>();
  //
  //   if (error) {
  //     throw error;
  //   }
  //
  //   return data.map((inventory) => InventoryMapper.toInventoryModel(inventory));
  // }
}
