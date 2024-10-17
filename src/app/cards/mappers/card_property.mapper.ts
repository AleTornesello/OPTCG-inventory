import {CardPropertyEntity} from "../entities/card_property.entity";
import {CardPropertyModel} from "../models/card_property.model";

export class CardPropertyMapper {

  public static toCardPropertyModel(set: CardPropertyEntity): CardPropertyModel {
    return new CardPropertyModel(
      set.id,
      set.key,
      this._toModelValueParser(set.key, set.value),
      set.card_id
    );
  }

  public static toCardPropertyEntity(set: CardPropertyModel): CardPropertyEntity {
    return new CardPropertyEntity(
      set.id,
      set.key,
      set.value,
      set.cardId
    );
  }

  private static _toModelValueParser(key: string, value: any) {
    switch (key) {
      case 'foil':
      case 'alternate_art':
      case 'manga_art':
        return value === 'true';
      case 'power':
      case 'counter':
      case 'art':
        return parseInt(value, 10);
      default:
        return value;
    }
  }
}
