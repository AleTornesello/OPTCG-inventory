import {Component, Input} from '@angular/core';
import {CardModel} from "../../models/card.model";
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {InputNumberComponent} from "../../../shared/components/inputs/input-number/input-number.component";
import {LowerCasePipe, NgClass} from "@angular/common";
import {TranslocoPipe} from "@jsverse/transloco";
import {SnakeCasePipe} from "../../../shared/pipes/snake-case.pipe";
import {CamelCasePipe} from "../../../shared/pipes/camel-case.pipe";
import {faEye, faSkull} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {GalleriaModule} from "primeng/galleria";

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
    FaIconComponent,
    GalleriaModule
  ],
  templateUrl: './card-preview.component.html',
  styleUrl: './card-preview.component.scss'
})
export class CardPreviewComponent {
  @Input({required: true}) card!: CardPreviewModel;

  public displayGallery: boolean;
  public galleryResponsiveOptions: any[];

  protected readonly faSkull = faSkull;
  protected readonly faEye = faEye;

  constructor() {
    this.displayGallery = false;
    this.galleryResponsiveOptions = [
      {
        breakpoint: '1500px',
        numVisible: 5
      },
      {
        breakpoint: '1024px',
        numVisible: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1
      }
    ];
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

  public get galleryImages(): { source: string, alt: string }[] {
    return [{
      source: this.card.card.imageUrl,
      alt: this.card.card.name
    }]
  }

  public onGalleryClick(): void {
    this.displayGallery = true;
  }
}
