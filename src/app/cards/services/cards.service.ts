import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {from, map, Observable} from "rxjs";
import {CardModel} from "../models/card.model";
import {collection, doc, Firestore, getDoc, getDocs, setDoc} from "@angular/fire/firestore";
import {InventoryModel} from "../models/inventory.model";

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  private readonly _listUrl = "https://deckbuilder.egmanevents.com/data/optcg.json";

  constructor(
    private _http: HttpClient,
    private _firestore: Firestore
  ) {
  }

  public getCardsList(): Observable<CardModel[]> {
    return this._http.get(this._listUrl)
      .pipe(map((response: any) => (response as any[]).map((card) => CardModel.fromJson(card))));
  }

  public getCardImageUrl(card: CardModel): string {
    return `https://deckbuilder.egmanevents.com/card_images/optcg/${card.key}.webp`;
  }

  public getCardQuantity(card: CardModel): Observable<InventoryModel | null> {
    const docRef = doc(this._firestore, 'inventory', card.key);
    const docSnap = getDoc(docRef);
    return from(docSnap)
      .pipe(
        map((doc) =>
          doc.exists()
            ? InventoryModel.fromFirestore(card.key, doc.data())
            : null
        )
      );
  }

  public updateCardQuantity(card: CardModel, quantity: number): Observable<void> {
    const docRef = doc(this._firestore, 'inventory', card.key);
    return from(setDoc(docRef, {quantity}, {merge: true}));
  }

  public getAllCardQuantities(): Observable<(InventoryModel | null)[]> {
    const collectionRef = collection(this._firestore, 'inventory');
    const docsSnap = getDocs(collectionRef);
    return from(docsSnap)
      .pipe(
        map((cardsInventory) =>
          cardsInventory.docs.map((cardInventory) => cardInventory.exists()
            ? InventoryModel.fromFirestore(cardInventory.id, cardInventory.data())
            : null)
        )
      );
  }
}
