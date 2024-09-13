import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {CardModel} from "../models/card.model";

@Injectable({
  providedIn: 'root'
})
export class CardsListService {

  private readonly _resourceUrl = "https://deckbuilder.egmanevents.com/data/optcg.json";

  constructor(
    private _http: HttpClient,
  ) {
  }

  public getCardsList(): Observable<CardModel[]> {
    return this._http.get(this._resourceUrl)
      .pipe(map((response: any) => (response as any[]).map((card) => CardModel.fromJson(card))));
  }

  public getCardImageUrl(card: CardModel): string {
    return `https://deckbuilder.egmanevents.com/card_images/optcg/${card.key}.webp`;
  }
}
