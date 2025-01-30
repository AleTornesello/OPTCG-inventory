export class SetEntity {
  id: string;
  code: string;
  name: string;
  ct_id: number;
  ct_game_id: number;
  set_group: string;
  created_at: string;
  created_by: string;

  constructor(
    id: string,
    code: string,
    name: string,
    ct_id: number,
    ct_game_id: number,
    set_group: string,
    created_at: string,
    created_by: string
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.ct_id = ct_id;
    this.ct_game_id = ct_game_id;
    this.set_group = set_group;
    this.created_at = created_at;
    this.created_by = created_by;
  }
}
