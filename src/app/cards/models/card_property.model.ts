export class CardPropertyModel {
  id: string;
  key: string;
  value: any;
  cardId: string;

  constructor(
    id: string,
    key: string,
    value: any,
    cardId: string
  ) {
    this.id = id;
    this.key = key;
    this.value = value;
    this.cardId = cardId;
  }
}
