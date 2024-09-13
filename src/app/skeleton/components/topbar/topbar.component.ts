import {Component, EventEmitter, Output} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {faArrowRightFromBracket, faBars} from '@fortawesome/free-solid-svg-icons';
import {SupabaseAuthService} from "../../../auth/services/supabase-auth.service";
import {Router} from "@angular/router";
import {OptcgRoute} from "../../../app.routes";

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
    private _authService: SupabaseAuthService,
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
