import {SetModel} from "./set.model";
import {InventoryModel} from "./inventory.model";

export class CardModel {
  id: string;
  code: string;
  name: string;
  imageUrl: string;
  setId: string;
  ctId: number;
  ctGameId: number;
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
  set: SetModel;
  inventory: InventoryModel | null;
  createdAt: Date;
  createdBy: string;

  constructor(
    id: string,
    code: string,
    name: string,
    imageUrl: string,
    setId: string,
    ctId: number,
    ctGameId: number,
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
    set: SetModel,
    inventory: InventoryModel | null,
    createdAt: string | Date,
    createdBy: string,
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.imageUrl = imageUrl;
    this.setId = setId;
    this.ctId = ctId;
    this.ctGameId = ctGameId;
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
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.createdBy = createdBy;
  }
}
