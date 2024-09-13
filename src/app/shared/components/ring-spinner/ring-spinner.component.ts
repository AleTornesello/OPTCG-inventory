import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-ring-spinner',
  templateUrl: './ring-spinner.component.html',
  styleUrls: ['./ring-spinner.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class RingSpinnerComponent {
  @Input() secondary: boolean;

  constructor() {
    this.secondary = false;
  }
}
