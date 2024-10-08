import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CardModel} from "../../models/card.model";
import {CardsService} from "../../services/cards.service";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {InputNumberComponent} from "../../../shared/components/inputs/input-number/input-number.component";
import {LowerCasePipe, NgClass} from "@angular/common";
import {TranslocoPipe} from "@jsverse/transloco";
import {SnakeCasePipe} from "../../../shared/pipes/snake-case.pipe";

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
    SnakeCasePipe
  ],
  templateUrl: './card-preview.component.html',
  styleUrl: './card-preview.component.scss'
})
export class CardPreviewComponent {
  @Input({required: true}) card!: CardPreviewModel;

  constructor(
  ) {
  }
}
