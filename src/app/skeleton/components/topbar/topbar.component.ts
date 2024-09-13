import {Component, EventEmitter, Output} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {faArrowRightFromBracket, faBars} from '@fortawesome/free-solid-svg-icons';
import {Router} from "@angular/router";
import {OptcgRoute} from "../../../app.routes";
import {FirebaseAuthService} from "../../../auth/services/firebase-auth.service";

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [ButtonModule, FontAwesomeModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  @Output() toggleSidebar: EventEmitter<void>;
  public faBars: IconDefinition = faBars;
  public faArrowRightFromBracket: IconDefinition = faArrowRightFromBracket;

  constructor(
    private _authService: FirebaseAuthService,
    private _router: Router
  ) {
    this.toggleSidebar = new EventEmitter();
  }

  public onToggleSidebarButtonClick() {
    this.toggleSidebar.emit();
  }

  public async onLogoutButtonClick() {
    await this._authService.signOut();
    await this._router.navigate([OptcgRoute.AUTH, OptcgRoute.LOGIN]);
  }
}
