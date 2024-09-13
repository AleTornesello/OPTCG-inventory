import { AfterViewInit, Component, DestroyRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { parse } from "qs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { StringManipulationService } from "../../../shared/services/string-manipulation.service";
import {
  ResultMessageDialogComponent
} from "../../../shared/components/dialog/result-message-dialog/result-message-dialog.component";
import { OptcgRoute } from "../../../app.routes";
import { TranslocoService } from "@jsverse/transloco";

@Component({
  selector: 'app-verify-email-page',
  standalone: true,
  imports: [
    ResultMessageDialogComponent
  ],
  templateUrl: './verify-email-page.component.html',
  styleUrl: './verify-email-page.component.scss',
})
export class VerifyEmailPageComponent implements AfterViewInit {
  @ViewChild('verifyResultDialog') verifyResultDialog!: ResultMessageDialogComponent;

  constructor(private _route: ActivatedRoute, private _destroyRef: DestroyRef, private _stringManipulationService: StringManipulationService, private _router: Router, private _translationService: TranslocoService) {
  }

  public ngAfterViewInit() {
    this._route.fragment.pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: this.onFragmentReceivedSuccess.bind(this),
        error: this.onFragmentReceivedError.bind(this)
      });
  }

  public onFragmentReceivedSuccess(fragment: string | null) {
    if (!fragment) {
      return;
    }
    const serializedData = parse(fragment);

    if (!serializedData) {
      this.verifyResultDialog.show("error", this._translationService.translate('auth.verifyEmailKo'));
      return;
    }

    if (serializedData['error']) {
      this.verifyResultDialog.show("error", this._translationService.translate('auth.verificationEmailErrors.' + this._stringManipulationService.snakeToCamel(serializedData['error'] as string)));
      return;
    }

    this.verifyResultDialog.show("success", this._translationService.translate('auth.verifyEmailOk'));

  }

  public onFragmentReceivedError() {
    this.verifyResultDialog.show("error", this._translationService.translate('auth.verifyEmailKo'));
  }

  public onVerifyResultDialogClose() {
    this._router.navigate([OptcgRoute.LOGIN]);
  }
}
