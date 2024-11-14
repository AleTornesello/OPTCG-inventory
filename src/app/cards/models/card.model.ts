export const MIN_COST = 0;
export const MAX_COST = 10;
export const MIN_POWER = 0;
export const MAX_POWER = 12000;

export class CardModel {
  id: string;
  code: string;
  name: string;
  imageUrl: string;
  setIds: string[];
  setCodes: string[];
  rarity: string;
  category: string;
  colors: string[];
  foil: boolean;
  don: boolean;
  alternateArt: boolean;
  mangaArt: boolean;
  inventoryId: string | null;
  inventoryQuantity: number | null;
  foilPropertyId: string | null;
  alternateArtPropertyId: string | null;
  mangaArtPropertyId: string | null;
  prb01Skull: boolean;
  prb01SkullPropertyId: string | null;

  constructor(
    id: string,
    code: string,
    name: string,
    imageUrl: string,
    setIds: string[],
    setCodes: string[],
    rarity: string,
    category: string,
    colors: string[],
    foil: boolean,
    don: boolean,
    alternateArt: boolean,
    mangaArt: boolean,
    inventoryId: string | null,
    inventoryQuantity: number | null,
    foilPropertyId: string | null,
    alternateArtPropertyId: string | null,
    mangaArtPropertyId: string | null,
    prb01Skull: boolean,
    prb01SkullPropertyId: string | null
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.imageUrl = imageUrl;
    this.setIds = setIds;
    this.setCodes = setCodes;
    this.rarity = rarity;
    this.category = category;
    this.colors = colors;
    this.foil = foil;
    this.don = don;
    this.alternateArt = alternateArt;
    this.mangaArt = mangaArt;
    this.inventoryId = inventoryId;
    this.inventoryQuantity = inventoryQuantity;
    this.foilPropertyId = foilPropertyId;
    this.alternateArtPropertyId = alternateArtPropertyId;
    this.mangaArtPropertyId = mangaArtPropertyId;
    this.prb01Skull = prb01Skull;
    this.prb01SkullPropertyId = prb01SkullPropertyId;
  }
}
