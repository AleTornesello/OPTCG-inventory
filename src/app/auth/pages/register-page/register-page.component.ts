import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {TranslocoModule, TranslocoPipe, TranslocoService} from '@jsverse/transloco';
import {CardModule} from 'primeng/card';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {Router, RouterModule} from '@angular/router';
import {OptcgRoute} from '../../../app.routes';
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {InputPasswordComponent} from "../../../shared/components/inputs/input-password/input-password.component";
import {MsjFormValidators} from "../../../shared/form/validators";
import {
  ResultMessageDialogComponent
} from "../../../shared/components/dialog/result-message-dialog/result-message-dialog.component";
import {NgOptimizedImage} from "@angular/common";
import {SupabaseAuthService} from "../../services/supabase-auth.service";
import {AuthError} from "@supabase/supabase-js";
import {StringManipulationService} from "../../../shared/services/string-manipulation.service";

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
    private _authService: SupabaseAuthService,
    private _stringManipulationService: StringManipulationService
  ) {
    this.form = this._buildForm();
  }

  public get registrationPageLink() {
    return `/${OptcgRoute.AUTH}/${OptcgRoute.LOGIN}`;
  }

  public async onFormSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {email, password} = this.form.value;

    try {
      await this._authService.signUp(email, password);
      this.registrationResultDialog.show("success", "auth.registrationOk");
    } catch (error) {
      if (error instanceof AuthError) {
        const errorMessage = error.code !== undefined
          ? this._translationService.translate(`auth.registerErrors.${this._stringManipulationService.snakeToCamel(error.code)}`)
          : error.message;
        this.registrationResultDialog.show("error", errorMessage);
        return;
      }
      this.registrationResultDialog.show("error", "auth.registerErrors.generic");
    }
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
    this._router.navigate([OptcgRoute.AUTH,OptcgRoute.LOGIN]);
  }
}
