import {Component, Input} from '@angular/core';
import {CardModel} from "../../models/card.model";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {InputNumberComponent} from "../../../shared/components/inputs/input-number/input-number.component";
import {LowerCasePipe, NgClass} from "@angular/common";
import {TranslocoPipe} from "@jsverse/transloco";
import {SnakeCasePipe} from "../../../shared/pipes/snake-case.pipe";
import {CamelCasePipe} from "../../../shared/pipes/camel-case.pipe";
import {faSkull} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

export interface CardPreviewModel {
  card: CardModel;
  quantity: number;
}

@Component({
  selector: 'app-card-preview',
  standalone: true,
  imports: [
    ButtonComponent,
    InputTextComponent,
    InputNumberComponent,
    NgClass,
    LowerCasePipe,
    TranslocoPipe,
    SnakeCasePipe,
    CamelCasePipe,
    FaIconComponent
  ],
  templateUrl: './card-preview.component.html',
  styleUrl: './card-preview.component.scss'
})
export class CardPreviewComponent {
  @Input({required: true}) card!: CardPreviewModel;

  protected readonly faSkull = faSkull;

  constructor() {
  }

  public get cardRarity(): string | null {
    return this.card.card.rarity;
  }

  public get isFoil(): boolean {
    return this.card.card.foil;
  }

  public get isAlternateArt(): boolean {
    return this.card.card.alternateArt;
  }

  public get isMangaArt(): boolean {
    return this.card.card.mangaArt;
  }

  public get isPrb01Skull(): boolean {
    return this.card.card.prb01Skull;
  }
}
