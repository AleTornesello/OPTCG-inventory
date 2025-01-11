import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appImageFallback]',
  standalone: true
})
export class ImageFallbackDirective {

  @Input() fallbackSrc: string;

  constructor(
    private _el: ElementRef
  ) {
    this.fallbackSrc = "images/cards/fallback-card.png"
  }

  @HostListener("error")
  loadOnError() {
    this._el.nativeElement.src = this.fallbackSrc;
  }

}
