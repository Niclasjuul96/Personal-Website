import { Auth, GoogleAuthProvider, getAuth, signInWithCredential } from 'firebase/auth';
import { getFirebaseApp } from './firebase-app';

const auth: Auth = getAuth(getFirebaseApp());

/**
 * Firestore's security rules check the *Firebase Auth* session's email,
 * not this site's own Google login state directly — so writes need a
 * Firebase Auth session established first. Reuses the site's existing
 * Google access token (via the whitelisted external client ID in
 * Firebase Auth's Google provider settings) instead of a second,
 * separate login popup. Shared by every service that writes to an
 * owner-gated Firestore collection (AllowedUsersService,
 * ProjectVisibilityService, ...).
 */
export async function ensureFirebaseAuth(accessToken: string): Promise<void> {
  if (auth.currentUser) {
    return;
  }
  const credential = GoogleAuthProvider.credential(null, accessToken);
  await signInWithCredential(auth, credential);
}
