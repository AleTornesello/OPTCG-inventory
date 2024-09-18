import {Injectable, OnDestroy} from "@angular/core";
import {SupabaseService} from "../../shared/services/supabase.service";
import {User} from "@supabase/supabase-js";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthService {

  public get user(): Promise<User | null> {
    return new Promise((resolve) =>
      this._supabaseService.supabase.auth.getSession()
        .then(({data: {session}}) => resolve(session?.user ?? null))
    );
  }

  constructor(
    private _supabaseService: SupabaseService,
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
