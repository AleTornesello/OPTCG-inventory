import {Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';

@Directive({
  selector: '[appScrollNearEnd]',
  standalone: true,
})
export class ScrollNearEndDirective implements OnInit {

  /**
   * threshold in PX when to emit before page end scroll
   */
  @Input() threshold: number;

  @Output() nearEnd: EventEmitter<void>;

  private _window!: Window;

  constructor(private _el: ElementRef) {
    this.threshold = 120;
    this.nearEnd = new EventEmitter();
  }

  public ngOnInit(): void {
    // save window object for type safety
    this._window = window;
  }

  @HostListener('window:scroll')
  public windowScrollEvent() {
    // height of whole window page
    const heightOfWholePage = this._window.document.documentElement.scrollHeight;

    // how big in pixels the element is
    const heightOfElement = this._el.nativeElement.scrollHeight;

    // currently scrolled Y position
    const currentScrolledY = this._window.scrollY;

    // height of opened window - shrinks if console is opened
    const innerHeight = this._window.innerHeight;

    /**
     * the area between the start of the page and when this element is visible
     * in the parent component
     */
    const spaceOfElementAndPage = heightOfWholePage - heightOfElement;

    // calculated whether we are near the end
    const scrollToBottom =
      heightOfElement - innerHeight - currentScrolledY + spaceOfElementAndPage;

    // if the user is near end
    if (scrollToBottom < this.threshold) {
      this.nearEnd.emit();
    }
  }
}
