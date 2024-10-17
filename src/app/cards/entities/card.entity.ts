import {SetEntity} from "./set.entity";
import {InventoryEntity} from "./inventory.entity";
import {CardPropertyEntity} from "./card_property.entity";

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
  foil: boolean;
  set: SetEntity;
  inventory: InventoryEntity | null;
  properties: CardPropertyEntity[];
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
    foil: boolean,
    set: SetEntity,
    inventory: InventoryEntity | null,
    properties: CardPropertyEntity[],
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
    this.foil = foil;
    this.set = set;
    this.inventory = inventory;
    this.properties = properties;
    this.created_at = created_at;
    this.created_by = created_by;
  }
}
