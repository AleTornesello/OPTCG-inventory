import {JwtPayload} from 'jwt-decode';
import {UserRoles} from "../../shared/models/authorization/user-roles";

class BaseJwtPayload implements JwtPayload {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;

  constructor(iss?: string,
              sub?: string,
              aud?: string[] | string,
              exp?: number,
              nbf?: number,
              iat?: number,
              jti?: string
  ) {
    this.iss = iss;
    this.sub = sub;
    this.aud = aud;
    this.exp = exp;
    this.nbf = nbf;
    this.iat = iat;
    this.jti = jti;
  }
}

export class SupabaseJwtPayload extends BaseJwtPayload {
  user_role: UserRoles;

  constructor(user_role: UserRoles,
              iss?: string,
              sub?: string,
              aud?: string[] | string,
              exp?: number,
              nbf?: number,
              iat?: number,
              jti?: string
  ) {
    super(iss, sub, aud, exp, nbf, iat, jti);
    this.user_role = user_role;
  }
}
