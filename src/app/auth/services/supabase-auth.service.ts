import {Injectable} from "@angular/core";
import {SupabaseService} from "../../shared/services/supabase.service";
import {User} from "@supabase/supabase-js";
import {environment} from "../../../environments/environment";
import {UserRoleService} from "../../shared/services/authorization/user-role.service";
import {jwtDecode} from "jwt-decode";
import {SupabaseJwtPayload} from "../models/jwt-payload";

@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthService {

  public get user(): Promise<User | null> {
    return new Promise((resolve) =>
      this._supabaseService.supabase.auth.getSession()
        .then(({data: {session}}) => {
          if (!session) {
            resolve(null)
          }

          const jwt = jwtDecode<SupabaseJwtPayload>(session!.access_token)
          this._userRoleService.currentUserRole = jwt.user_role;

          resolve(session!.user)
        })
    );
  }

  constructor(
    private _supabaseService: SupabaseService,
    private _userRoleService: UserRoleService
  ) {
  }

  public async signIn(email: string, password: string): Promise<User | null> {
    const response = await this._supabaseService.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (response.error) {
      throw response.error;
    }

    return response.data.user;
  }

  public async signUp(email: string, password: string): Promise<User | null> {
    const response = await this._supabaseService.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: environment.supabase.emailRedirectTo
      }
    });

    if (response.error) {
      throw response.error;
    }

    return response.data.user;
  }

  public async signOut(): Promise<void> {
    const {error} = await this._supabaseService.supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }
}
