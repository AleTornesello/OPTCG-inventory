export class CardPropertyEntity {
  id: string;
  key: string;
  value: string;
  card_id: string;

  constructor(
    id: string,
    key: string,
    value: string,
    cardId: string
  ) {
    this.id = id;
    this.key = key;
    this.value = value;
    this.card_id = cardId;
  }
}
