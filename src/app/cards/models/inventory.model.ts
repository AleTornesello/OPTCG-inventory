export class InventoryModel {

  public key: string;
  public quantity: number;

  constructor(key: string, quantity: number) {
    this.key = key;
    this.quantity = quantity;
  }

  public static fromFirestore(key: string, doc: any): InventoryModel {
    return new InventoryModel(key, doc['quantity']);
  }

  toFirestore(): any {
    return {
      key: this.key,
      quantity: this.quantity
    }
  }
}
