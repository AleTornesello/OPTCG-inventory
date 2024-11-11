export class CardEntity {
  id: string;
  code: string;
  name: string;
  image_url: string;
  set_ids: string[];
  set_codes: string[];
  rarity: string;
  category: string;
  colors: string[];
  foil: boolean;
  don: boolean;
  alternate_art: boolean;
  manga_art: boolean;
  inventory_id: string | null;
  inventory_quantity: number | string | null;
  foil_property_id: string | null;
  alternate_art_property_id: string | null;
  manga_art_property_id: string | null;
  prb01_skull: boolean;
  prb01_skull_property_id: string | null;

  constructor(
    id: string,
    code: string,
    name: string,
    image_url: string,
    set_ids: string[],
    set_codes: string[],
    rarity: string,
    category: string,
    colors: string[],
    foil: boolean,
    don: boolean,
    alternate_art: boolean,
    manga_art: boolean,
    inventory_id: string | null,
    inventory_quantity: number | string | null,
    foil_property_id: string | null,
    alternate_art_property_id: string | null,
    manga_art_property_id: string | null,
    prb01_skull: boolean,
    prb01_skull_property_id: string | null
  ) {

    this.id = id;
    this.code = code;
    this.name = name;
    this.image_url = image_url;
    this.set_ids = set_ids;
    this.set_codes = set_codes;
    this.rarity = rarity;
    this.category = category;
    this.colors = colors;
    this.foil = foil;
    this.don = don;
    this.alternate_art = alternate_art;
    this.manga_art = manga_art;
    this.inventory_id = inventory_id;
    this.inventory_quantity = inventory_quantity;
    this.foil_property_id = foil_property_id;
    this.alternate_art_property_id = alternate_art_property_id;
    this.manga_art_property_id = manga_art_property_id;
    this.prb01_skull = prb01_skull;
    this.prb01_skull_property_id = prb01_skull_property_id;
  }
}
