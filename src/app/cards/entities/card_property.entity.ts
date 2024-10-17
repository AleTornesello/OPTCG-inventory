export class CardPropertyEntity {
  id: string;
  key: string;
  value: {
    value: any
  };

  constructor(
    id: string,
    key: string,
    value: {
      value: any
    }
  ) {
    this.id = id;
    this.key = key;
    this.value = value;
  }
}
