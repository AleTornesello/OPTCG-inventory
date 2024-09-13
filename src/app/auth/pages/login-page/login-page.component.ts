import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {TranslocoPipe, TranslocoService} from '@jsverse/transloco';
import {CardModule} from 'primeng/card';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {Router, RouterModule} from '@angular/router';
import {OptcgRoute} from '../../../app.routes';
import {InputPasswordComponent} from "../../../shared/components/inputs/input-password/input-password.component";
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {
  ResultMessageDialogComponent
} from "../../../shared/components/dialog/result-message-dialog/result-message-dialog.component";
import {StringManipulationService} from "../../../shared/services/string-manipulation.service";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-login-page',
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
    NgOptimizedImage,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  @ViewChild('loginResultDialog') loginResultDialog!: ResultMessageDialogComponent;
  public form: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _translationService: TranslocoService,
    private _router: Router,
    private _stringManipulationService: StringManipulationService
  ) {
    this.form = this._buildForm();
  }

  private _buildForm() {
    return this._fb.group({
      email: this._fb.control('', [Validators.required, Validators.email]),
      password: this._fb.control('', [Validators.required]),
    });
  }

  public async onFormSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // TODO signin

    this._router.navigate([]);
  }

  public get registrationPageLink() {
    return `/${OptcgRoute.AUTH}/${OptcgRoute.REGISTER}`;
  }
}
