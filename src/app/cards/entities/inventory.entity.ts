export class InventoryEntity {

  public key: string;
  public quantity: number;
  public created_by: string;

  constructor(key: string, quantity: number, created_by: string) {
    this.key = key;
    this.quantity = quantity;
    this.created_by = created_by;
  }
}
