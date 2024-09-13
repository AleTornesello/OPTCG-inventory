import {Environment} from '../app/shared/models/environment.model';

export const environment: Environment = {
  production: false,
  firebase: {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
  },
  // Base Href with heading slash, trailing slash and trailing hash
  baseHref: '/#/'
};
