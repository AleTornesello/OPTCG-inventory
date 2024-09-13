import {animate, state, style, transition, trigger,} from '@angular/animations';
import {Component, DestroyRef, OnInit} from '@angular/core';
import {LoaderStatusService} from '../../services/loader-status.service';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {RingSpinnerComponent} from "../ring-spinner/ring-spinner.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-overlay-loader',
  templateUrl: './overlay-loader.component.html',
  styleUrls: ['./overlay-loader.component.scss'],
  animations: [
    trigger('loadingAnimation', [
      state('open', style({opacity: 1})),
      transition('void => *', [
        style({
          opacity: 0,
        }),
        animate('0.5s'),
      ]),
    ]),
  ],
  imports: [
    RingSpinnerComponent,
    CommonModule
  ],
  standalone: true,
})
export class OverlayLoaderComponent implements OnInit {
  public loading: boolean;

  constructor(private _loaderService: LoaderStatusService, private _destroyRef: DestroyRef) {
    this.loading = false;
  }

  ngOnInit(): void {
    this._loaderService.notify
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (status) => {
          this.loading = status;
        }
      });
  }
}
