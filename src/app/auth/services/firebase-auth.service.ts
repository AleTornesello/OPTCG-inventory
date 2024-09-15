import {Injectable} from "@angular/core";
import {Auth, signInWithEmailAndPassword, user, User} from "@angular/fire/auth";
import {Observable} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {UserCredential, browserSessionPersistence, setPersistence} from "@firebase/auth";

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {

  public user: User | null;

  private _user$: Observable<User | null>;

  constructor(
    private _firebaseAuth: Auth
  ) {
    this._user$ = user(_firebaseAuth);
    this.user = null;
    this._user$
      .pipe(takeUntilDestroyed())
      .subscribe((aUser: User | null) => {
        this.user = aUser;
      });
  }

  public async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      await setPersistence(this._firebaseAuth, browserSessionPersistence);
      return await signInWithEmailAndPassword(this._firebaseAuth, email, password);
    } catch (error) {
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    await this._firebaseAuth.signOut();
  }
}
