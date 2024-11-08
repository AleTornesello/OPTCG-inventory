import {CardEntity} from "../entities/card.entity";
import {CardModel} from "../models/card.model";

export class CardMapper {

  public static toCardModel(card: CardEntity): CardModel {
    return new CardModel(
      card.id,
      card.code,
      card.name,
      card.image_url,
      card.set_id,
      card.set_code,
      card.rarity,
      card.category,
      card.colors,
      card.foil,
      card.don,
      card.alternate_art,
      card.manga_art,
      card.inventory_id,
      card.inventory_quantity !== null
        ? typeof card.inventory_quantity === 'string'
          ? parseInt(card.inventory_quantity)
          : card.inventory_quantity
        : null,
      card.foil_property_id,
      card.alternate_art_property_id,
      card.manga_art_property_id
    );
  }

  public static toCardEntity(card: CardModel): CardEntity {
    return new CardEntity(
      card.id,
      card.code,
      card.name,
      card.imageUrl,
      card.setId,
      card.setCode,
      card.rarity,
      card.category,
      card.colors,
      card.foil,
      card.don,
      card.alternateArt,
      card.mangaArt,
      card.inventoryId,
      card.inventoryQuantity,
      card.foilPropertyId,
      card.alternateArtPropertyId,
      card.mangaArtPropertyId
    );
  }
}
