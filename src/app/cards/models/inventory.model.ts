export class InventoryModel {

  public id: string;
  public quantity: number;
  public cardId: string;
  public createdAt: Date;
  public createdBy: string;

  constructor(id: string, quantity: number, cardId: string, createdAt: Date | string, createdBy: string) {
    this.id = id;
    this.quantity = quantity;
    this.cardId = cardId;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.createdBy = createdBy;
  }
}
