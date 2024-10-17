import {CardPropertyEntity} from "../entities/card_property.entity";
import {CardPropertyModel} from "../models/card_property.model";

export class CardPropertyMapper {

  public static toCardPropertyModel(set: CardPropertyEntity): CardPropertyModel {
    return new CardPropertyModel(
      set.id,
      set.key,
      set.value.value
    );
  }

  public static toCardPropertyEntity(set: CardPropertyModel): CardPropertyEntity {
    return new CardPropertyEntity(
      set.id,
      set.key,
      {
        value: set.value
      }
    );
  }
}
