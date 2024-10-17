export class CardPropertyModel {
  id: string;
  key: string;
  value: any;

  constructor(
    id: string,
    key: string,
    value: any
  ) {
    this.id = id;
    this.key = key;
    this.value = value;
  }
}
