import { initializeApp, FirebaseApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '../constants/firebase-config';

let app: FirebaseApp | null = null;

/**
 * Firebase's initializeApp() throws if called more than once. Multiple
 * services (Firestore, Auth) need the same app instance, so this is the
 * single place that creates it.
 */
export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(FIREBASE_CONFIG);
  }
  return app;
}
