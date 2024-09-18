export interface Environment {
  production: boolean;
  supabase: {
    url: string;
    key: string;
    emailRedirectTo: string;
  };
  baseHref: string;
}
