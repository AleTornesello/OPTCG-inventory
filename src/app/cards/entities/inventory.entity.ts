export class InventoryEntity {

  public id: string;
  public quantity: number;
  public card_id: string;
  public created_at: string;
  public created_by: string;


  constructor(id: string, quantity: number, card_id: string, created_at: string, created_by: string) {
    this.id = id;
    this.quantity = quantity;
    this.card_id = card_id;
    this.created_at = created_at;
    this.created_by = created_by;
  }
}
