import {AfterContentChecked, AfterViewChecked, Component, Input} from '@angular/core';
import Glide from "@glidejs/glide";
import {ButtonComponent} from "../button/button.component";
import {TranslocoPipe} from "@jsverse/transloco";
import {CommonModule, NgClass} from "@angular/common";
import {Button} from "primeng/button";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";

export interface GalleryImage {
  id: string;
  imageUri: string;
  label?: string | null;
  index: number;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    TranslocoPipe,
    NgClass,
    Button,
    FaIconComponent
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements AfterViewChecked {
  @Input() images: GalleryImage[] = [];

  @Input() set index(value: number) {
    this._index = value;
  }

  get index(): number {
    return this._index;
  }

  public visible: boolean;

  protected readonly faChevronLeft = faChevronLeft;
  protected readonly faChevronRight = faChevronRight;

  private _index: number;
  private _glide?: Glide;
  private _refreshGlide: boolean;

  constructor() {
    this._index = 0;
    this.visible = false;
    this._refreshGlide = false;
  }

  public ngAfterViewChecked() {
    if(!this._refreshGlide) {
      return;
    }
    this._initGlide(this._index);
    this._refreshGlide = false;
  }

  private _initGlide(index: number = 0) {
    if (this._glide) {
      this._glide.destroy();
    }
    this._glide = new Glide(
      ".glide",
      {
        type: "carousel",
        startAt: index,
        perView: 1,
        focusAt: 'center'
      }
    );
    this._glide.mount();
  }

  public onCloseButtonClick() {
    this.visible = false;
  }

  public show(index: number) {
    this._index = index;
    this.visible = true;
    this._refreshGlide = true;
  }
}
