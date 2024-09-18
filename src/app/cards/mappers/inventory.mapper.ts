import {InventoryEntity} from "../entities/inventory.entity";
import {InventoryModel} from "../models/inventory.model";

export class InventoryMapper {

  public static toInventoryModel(inventory: InventoryEntity): InventoryModel {
    return new InventoryModel(
      inventory.id,
      inventory.quantity,
      inventory.card_id,
      inventory.created_at,
      inventory.created_by
    );
  }

  public static toInventoryEntity(inventory: InventoryModel): InventoryEntity {
    return new InventoryEntity(
      inventory.id,
      inventory.quantity,
      inventory.cardId,
      inventory.createdAt.toISOString(),
      inventory.createdBy
    );
  }
}
