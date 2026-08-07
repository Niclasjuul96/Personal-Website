import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { Auth, GoogleAuthProvider, getAuth, signInWithCredential } from 'firebase/auth';
import { getFirebaseApp } from './firebase-app';

/**
 * Roles are a plain string union on purpose — adding a new role later
 * (e.g. 'editor') is a one-line type change, and any code that switches
 * on a user's role (rather than just checking for one specific role)
 * gets the new case for free via TypeScript's exhaustiveness checking.
 */
export type Role = 'owner' | 'member';

export interface AllowedUser {
  email: string;
  role: Role;
}

export interface AllowedUserRecord extends AllowedUser {
  /** Firestore document id — always the lowercased email, see addOrUpdateUser. */
  id: string;
}

/**
 * The one email that can always write to the allowlist, hardcoded here
 * AND in Firestore's security rules (must match exactly, case-insensitive
 * compare on both sides). This is deliberately NOT read from Firestore —
 * it's the root of trust that lets the very first owner record get
 * created in an empty collection. Everyone else added later (via the
 * admin UI, stored in Firestore) only gets read access to gated pages;
 * actual write access to this list stays with this one hardcoded email
 * unless the Firestore rule itself is updated to trust more emails.
 */
export const BOOTSTRAP_OWNER_EMAIL = 'Niclasschaeffer96@gmail.com';

const COLLECTION_NAME = 'allowedUsers';

@Injectable({
  providedIn: 'root',
})
export class AllowedUsersService {
  private db: Firestore = getFirestore(getFirebaseApp());
  private auth: Auth = getAuth(getFirebaseApp());

  private users$ = new BehaviorSubject<AllowedUserRecord[]>([]);
  private loaded$ = new BehaviorSubject<boolean>(false);

  /** Live list of everyone currently allowed, for the admin UI to display. */
  users = this.users$.asObservable();

  /** True once the initial Firestore read has completed (success or failure). */
  loaded = this.loaded$.asObservable();

  constructor() {
    // Deferred a tick: subscribing synchronously in the constructor races
    // the Firestore client's own internal startup — a request fired that
    // early can come back permission-denied even against a fully public
    // rule, and unlike transient network errors, Firestore doesn't retry
    // a permission-denied listener on its own. Letting the current
    // synchronous phase finish first avoids the race entirely.
    setTimeout(() => this.subscribeToAllowlist(), 0);
  }

  private subscribeToAllowlist(): void {
    onSnapshot(
      collection(this.db, COLLECTION_NAME),
      (snapshot) => {
        this.users$.next(
          snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as AllowedUser) }))
        );
        this.loaded$.next(true);
      },
      (error) => {
        console.error('[AllowedUsers] Failed to load allowlist:', error);
        this.loaded$.next(true);
      }
    );
  }

  /** Synchronous — safe to call from a route guard. */
  getRole(email: string | null): Role | null {
    if (!email) {
      return null;
    }
    const normalized = email.toLowerCase();
    return this.users$.value.find((u) => u.email.toLowerCase() === normalized)?.role ?? null;
  }

  /**
   * Called after every login. A no-op unless this is the very first time
   * the bootstrap owner has ever logged in after this feature shipped —
   * once the allowlist has at least one entry, this never writes again.
   * Solves the chicken-and-egg problem of an owner-only admin UI needing
   * an owner record to exist before anyone (including the real owner)
   * can create one.
   */
  async ensureOwnerBootstrapped(email: string, accessToken: string): Promise<void> {
    if (!this.loaded$.value || this.users$.value.length > 0) {
      return;
    }
    if (email.toLowerCase() !== BOOTSTRAP_OWNER_EMAIL.toLowerCase()) {
      return;
    }
    try {
      await this.addOrUpdateUser(email, 'owner', accessToken);
    } catch (error) {
      console.error('[AllowedUsers] Owner bootstrap failed:', error);
    }
  }

  /**
   * Adds a new allowed email, or changes an existing one's role.
   * Firestore's security rules — not this method — are what actually
   * enforce that only the owner can do this; a non-owner calling this
   * will get a permission-denied error from Firestore itself.
   */
  async addOrUpdateUser(email: string, role: Role, accessToken: string): Promise<void> {
    await this.ensureFirebaseAuth(accessToken);
    const id = email.toLowerCase();
    await setDoc(doc(this.db, COLLECTION_NAME, id), { email, role });
  }

  async removeUser(email: string, accessToken: string): Promise<void> {
    await this.ensureFirebaseAuth(accessToken);
    const id = email.toLowerCase();
    await deleteDoc(doc(this.db, COLLECTION_NAME, id));
  }

  /**
   * Firestore's security rules check the *Firebase Auth* session's email,
   * not this site's own Google login state directly — so writes need a
   * Firebase Auth session established first. Reuses the site's existing
   * Google access token (via the whitelisted external client ID in
   * Firebase Auth's Google provider settings) instead of a second,
   * separate login popup.
   */
  private async ensureFirebaseAuth(accessToken: string): Promise<void> {
    if (this.auth.currentUser) {
      return;
    }
    const credential = GoogleAuthProvider.credential(null, accessToken);
    await signInWithCredential(this.auth, credential);
  }
}
