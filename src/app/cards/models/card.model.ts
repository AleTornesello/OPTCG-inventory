export class CardModel {
  public key: string;
  public cardId: string[];
  public rarity: string;
  public category: string;
  public cardName: string;
  public cost: { generic: number };
  public power: number;
  public counter: number;
  public color: string[];
  public type: string[];
  public effect: string;
  public art: number;
  public trigger: string;
  public set: string;

  constructor(key: string, cardId: string[], rarity: string, category: string, cardName: string, cost: { generic: number }, power: number, counter: number, color: string[], type: string[], effect: string, art: number, trigger: string, set: string) {
    this.key = key;
    this.cardId = cardId;
    this.rarity = rarity;
    this.category = category;
    this.cardName = cardName;
    this.cost = cost;
    this.power = power;
    this.counter = counter;
    this.color = color;
    this.type = type;
    this.effect = effect;
    this.art = art;
    this.trigger = trigger;
    this.set = set;
  }

  public static fromJson(json: any): CardModel {
    return new CardModel(
      json['Key'],
      json['CARD ID'],
      json['Rarity'],
      json['Category'],
      json['Card Name'],
      json['Cost'],
      json['Power'],
      json['Counter'],
      json['Color'],
      json['Type'],
      json['Effect'],
      json['Art'],
      json['Trigger'],
      json['Set']
    );
  }
}
