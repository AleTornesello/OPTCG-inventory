export class CardEntity {
  id: string;
  code: string;
  name: string;
  image_url: string;
  set_id: string;
  set_code: string;
  rarity: string;
  category: string;
  colors: string[];
  foil: boolean;
  don: boolean;
  alternate_art: boolean;
  manga_art: boolean;
  inventory_id: string | null;
  inventory_quantity: number | string | null;

  constructor(
    id: string,
    code: string,
    name: string,
    image_url: string,
    set_id: string,
    set_code: string,
    rarity: string,
    category: string,
    colors: string[],
    foil: boolean,
    don: boolean,
    alternate_art: boolean,
    manga_art: boolean,
    inventory_id: string | null,
    inventory_quantity: number | string | null
  ) {

    this.id = id;
    this.code = code;
    this.name = name;
    this.image_url = image_url;
    this.set_id = set_id;
    this.set_code = set_code;
    this.rarity = rarity;
    this.category = category;
    this.colors = colors;
    this.foil = foil;
    this.don = don;
    this.alternate_art = alternate_art;
    this.manga_art = manga_art;
    this.inventory_id = inventory_id;
    this.inventory_quantity = inventory_quantity;
  }
}
