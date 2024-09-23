export class UserSettingsEntity {
  public id: string;
  public key: string;
  public value: any;
  public meta: any;
  public created_at: string;
  public created_by: string;

  constructor(
    id: string,
    key: string,
    value: any,
    meta: any,
    created_at: string,
    created_by: string
  ) {
    this.id = id;
    this.key = key;
    this.value = value;
    this.meta = meta;
    this.created_at = created_at;
    this.created_by = created_by;
  }
}
