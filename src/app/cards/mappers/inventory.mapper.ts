import {InventoryEntity} from "../entities/inventory.entity";
import {InventoryModel} from "../models/inventory.model";

export class InventoryMapper {

  public static toInventoryModel(inventory: InventoryEntity): InventoryModel {
    return new InventoryModel(
      inventory.key,
      inventory.quantity,
      inventory.created_by
    );
  }

  public static toInventoryEntity(inventory: InventoryModel): InventoryEntity {
    return new InventoryEntity(
      inventory.key,
      inventory.quantity,
      inventory.createdBy
    );
  }
}
