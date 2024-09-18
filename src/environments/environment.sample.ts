import {Environment} from '../app/shared/models/environment.model';

export const environment: Environment = {
  production: false,
  supabase: {
    url: '...',
    key: '...',
    emailRedirectTo: 'https://...'
  },
  // Base Href with heading slash, trailing slash and trailing hash
  baseHref: '/#/'
};
