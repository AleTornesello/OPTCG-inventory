export class InventoryModel {

  public key: string;
  public quantity: number;
  public createdBy: string;

  constructor(key: string, quantity: number, createdBy: string) {
    this.key = key;
    this.quantity = quantity;
    this.createdBy = createdBy;
  }

  public static fromFirestore(key: string, doc: any): InventoryModel {
    return new InventoryModel(key, doc['quantity'], doc['created_by']);
  }

  toFirestore(): any {
    return {
      key: this.key,
      quantity: this.quantity,
      created_by: this.createdBy
    }
  }
}
