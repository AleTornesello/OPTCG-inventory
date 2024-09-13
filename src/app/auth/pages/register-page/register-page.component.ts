import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {TranslocoModule, TranslocoPipe, TranslocoService} from '@jsverse/transloco';
import {CardModule} from 'primeng/card';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {Router, RouterModule, UrlSerializer} from '@angular/router';
import {OptcgRoute} from '../../../app.routes';
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {InputPasswordComponent} from "../../../shared/components/inputs/input-password/input-password.component";
import {MsjFormValidators} from "../../../shared/form/validators";
import {
  ResultMessageDialogComponent
} from "../../../shared/components/dialog/result-message-dialog/result-message-dialog.component";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CardModule,
    TranslocoPipe,
    ReactiveFormsModule,
    InputTextComponent,
    InputPasswordComponent,
    ButtonComponent,
    RouterModule,
    ResultMessageDialogComponent,
    TranslocoModule,
    NgOptimizedImage,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  @ViewChild('registrationResultDialog') registrationResultDialog!: ResultMessageDialogComponent;

  public form: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _translationService: TranslocoService,
    private _router: Router,
  ) {
    this.form = this._buildForm();
  }

  public get registrationPageLink() {
    return `/${OptcgRoute.LOGIN}`;
  }

  public async onFormSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // TODO signup
  }

  private _buildForm() {
    const passwordControl = this._fb.control('', [Validators.required, Validators.minLength(8)]);
    return this._fb.group({
      email: this._fb.control('', [Validators.required, Validators.email]),
      password: passwordControl,
      confirmPassword: this._fb.control('', [Validators.required, MsjFormValidators.samePassword(passwordControl)]),
    });
  }

  public onRegistrationResultDialogClose() {
    this._router.navigate([OptcgRoute.LOGIN]);
  }
}
