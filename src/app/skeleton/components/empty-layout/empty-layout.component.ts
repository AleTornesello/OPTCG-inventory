import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToastModule} from "primeng/toast";
import {OverlayLoaderComponent} from "../../../shared/components/overlay-loader/overlay-loader.component";

@Component({
  selector: 'app-empty-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastModule, OverlayLoaderComponent],
  templateUrl: './empty-layout.component.html',
  styleUrl: './empty-layout.component.scss'
})
export class EmptyLayoutComponent {
}
