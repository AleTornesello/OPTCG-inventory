import {SetEntity} from "./set.entity";

export class CardEntity {
  id: string;
  code: string;
  name: string;
  image_url: string;
  set_id: string;
  ct_id: number;
  ct_game_id: number;
  rarity: string;
  color: string[];
  power: number;
  counter: number;
  category: string;
  cost: number;
  art: number;
  effect: string | null;
  type: string[];
  set: SetEntity;
  created_at: string;
  created_by: string;

  constructor(
    id: string,
    code: string,
    name: string,
    image_url: string,
    set_id: string,
    ct_id: number,
    ct_game_id: number,
    rarity: string,
    color: string[],
    power: number,
    counter: number,
    category: string,
    cost: number,
    art: number,
    effect: string | null,
    type: string[],
    set: SetEntity,
    created_at: string,
    created_by: string,
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.image_url = image_url;
    this.set_id = set_id;
    this.ct_id = ct_id;
    this.ct_game_id = ct_game_id;
    this.rarity = rarity;
    this.color = color;
    this.power = power;
    this.counter = counter;
    this.category = category;
    this.cost = cost;
    this.art = art;
    this.effect = effect;
    this.type = type;
    this.set = set;
    this.created_at = created_at;
    this.created_by = created_by;
  }
}
