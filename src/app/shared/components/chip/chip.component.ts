import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss'
})
export class ChipComponent {

  @Input() label: string;

  @Output() remove: EventEmitter<void>;

  protected readonly faTimesCircle = faTimesCircle;

  constructor() {
    this.label = '';
    this.remove = new EventEmitter();
  }

  public onRemoveClick() {
    this.remove.emit();
  }
}
