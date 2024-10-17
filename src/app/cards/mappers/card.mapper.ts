import {CardEntity} from "../entities/card.entity";
import {CardModel} from "../models/card.model";
import {SetMapper} from "./set.mapper";
import {InventoryMapper} from "./inventory.mapper";
import {CardPropertyMapper} from "./card_property.mapper";

export class CardMapper {

  public static toCardModel(card: CardEntity): CardModel {
    return new CardModel(
      card.id,
      card.code,
      card.name,
      card.image_url,
      card.set_id,
      card.ct_id,
      card.ct_game_id,
      card.rarity,
      card.color,
      card.power,
      card.counter,
      card.category,
      card.cost,
      card.art,
      card.effect,
      card.type,
      card.foil,
      SetMapper.toSetModel(card.set),
      card.inventory
        ? Array.isArray(card.inventory) && card.inventory.length > 0
          ? InventoryMapper.toInventoryModel(card.inventory[0])
          : null
        : null,
      card.properties.map((p) => CardPropertyMapper.toCardPropertyModel(p)),
      card.created_at,
      card.created_by,
    );
  }

  public static toCardEntity(card: CardModel): CardEntity {
    return new CardEntity(
      card.id,
      card.code,
      card.name,
      card.imageUrl,
      card.setId,
      card.ctId,
      card.ctGameId,
      card.rarity,
      card.color,
      card.power,
      card.counter,
      card.category,
      card.cost,
      card.art,
      card.effect,
      card.type,
      card.foil,
      SetMapper.toSetEntity(card.set),
      card.inventory
        ? Array.isArray(card.inventory) && card.inventory.length > 0
          ? InventoryMapper.toInventoryEntity(card.inventory[0])
          : null
        : null,
      card.properties.map((p) => CardPropertyMapper.toCardPropertyEntity(p)),
      card.createdAt.toISOString(),
      card.createdBy,
    );
  }
}
