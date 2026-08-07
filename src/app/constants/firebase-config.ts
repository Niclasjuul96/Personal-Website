/**
 * Firebase project config for the live-editable allowed-users list.
 * Separate, dedicated Firebase project from the Chat-App side project —
 * this one exists purely for this site's own data (allowlist, and later
 * the per-project visibility toggle), not mixed with chat data.
 *
 * This is the standard Firebase Web SDK config object — like the OAuth
 * Client ID and Picker API key elsewhere in this app, these values are
 * meant to be public in client-side code. Real protection comes from
 * Firestore security rules, not from hiding this config.
 */
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAZ0s6c0tEemZmdw7wNuV2Wmjfd9lyc_dE',
  authDomain: 'personal-website-8655e.firebaseapp.com',
  projectId: 'personal-website-8655e',
  storageBucket: 'personal-website-8655e.firebasestorage.app',
  messagingSenderId: '76275768047',
  appId: '1:76275768047:web:481664ff37fb4de6e1591a',
};
