import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Firestore, collection, deleteDoc, doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';
import { getFirebaseApp } from './firebase-app';
import { ensureFirebaseAuth } from './firebase-auth-bridge';
import { buildDocId, extractProjectId } from './project-id-slug';

/**
 * Two independent controls per project, not one 3-way picker — matches the
 * roadmap's decision: a primary Live/Off switch, plus a "Coming soon"
 * checkbox that only applies when the project is Off.
 *   live: true                    -> Live (fully visible/usable)
 *   live: false, comingSoon: true -> Coming soon (teaser card, not usable)
 *   live: false, comingSoon: false -> Hidden (nothing shown to visitors)
 */
export interface ProjectVisibilityState {
  live: boolean;
  comingSoon: boolean;
}

export interface ProjectVisibilityRecord extends ProjectVisibilityState {
  id: string;
}

const COLLECTION_NAME = 'projectVisibility';

/**
 * Project order lives in its own single-document collection rather than as
 * a field on each project's visibility doc — it's one global ordering, not
 * a per-project value, so a single doc avoids needing N writes (one per
 * moved project) every time two projects swap places.
 */
const ORDER_COLLECTION = 'projectOrder';
const ORDER_DOC_ID = 'order';

/**
 * No Firestore doc yet = the project stays exactly as visible as it
 * always was before this feature existed. Only projects the owner
 * explicitly toggles off get a doc written for them.
 */
const DEFAULT_STATE: ProjectVisibilityState = { live: true, comingSoon: false };

@Injectable({
  providedIn: 'root',
})
export class ProjectVisibilityService {
  private db: Firestore = getFirestore(getFirebaseApp());

  private states$ = new BehaviorSubject<Record<string, ProjectVisibilityState>>({});
  private loaded$ = new BehaviorSubject<boolean>(false);
  private order$ = new BehaviorSubject<string[]>([]);

  /** Live map of projectId -> state, for the admin UI to display. */
  states = this.states$.asObservable();

  /** True once the initial Firestore read has completed (success or failure). */
  loaded = this.loaded$.asObservable();

  /** Live explicit ordering (project ids). Empty until the owner reorders anything. */
  order = this.order$.asObservable();

  constructor() {
    // Same deferred-subscribe pattern as AllowedUsersService, for the same
    // reason: subscribing synchronously in the constructor races
    // Firestore's own internal client startup and can bounce off a fully
    // public rule with permission-denied, which onSnapshot never retries.
    setTimeout(() => this.subscribe(), 0);
    setTimeout(() => this.subscribeOrder(), 0);
  }

  private subscribe(): void {
    onSnapshot(
      collection(this.db, COLLECTION_NAME),
      (snapshot) => {
        const map: Record<string, ProjectVisibilityState> = {};
        snapshot.docs.forEach((d) => {
          map[extractProjectId(d.id)] = d.data() as ProjectVisibilityState;
        });
        this.states$.next(map);
        this.loaded$.next(true);
      },
      (error) => {
        console.error('[ProjectVisibility] Failed to load project visibility:', error);
        this.loaded$.next(true);
      }
    );
  }

  private subscribeOrder(): void {
    onSnapshot(
      doc(this.db, ORDER_COLLECTION, ORDER_DOC_ID),
      (snapshot) => {
        const data = snapshot.data() as { ids?: unknown[] } | undefined;
        // Defensively drops anything that isn't a real id string — Firestore
        // silently stores an `undefined` array entry as `null` rather than
        // rejecting the write (unlike a top-level undefined field, which
        // does throw), so a bad write elsewhere can otherwise leave this
        // array full of nulls. Filtering here means a corrupted stored
        // array just falls back to natural order instead of breaking
        // rendering — self-healing on every read, no manual Firestore
        // cleanup ever required.
        const ids = (data?.ids ?? []).filter(
          (id): id is string => typeof id === 'string' && id.length > 0
        );
        this.order$.next(ids);
      },
      (error) => {
        console.error('[ProjectVisibility] Failed to load project order:', error);
      }
    );
  }

  /**
   * Synchronous — safe to call from a template. Defaults to live/visible.
   * Normalizes `projectId` through extractProjectId() so this keeps
   * matching correctly whether the caller passes a bare legacy id ("1")
   * or the project's own already-readable id ("1-chat-app") — both reduce
   * to the same leading token this service's own docs are keyed by.
   */
  getState(projectId: string): ProjectVisibilityState {
    return this.states$.value[extractProjectId(projectId)] ?? DEFAULT_STATE;
  }

  /**
   * Synchronous — orders `defaultIds` (the projects' natural code-defined
   * order) by the stored explicit order, appending any id with no explicit
   * position yet (new projects added after the last reorder) at the end in
   * their natural order. No stored order at all = defaultIds unchanged.
   *
   * Matches by extractProjectId() token, not exact string — a stored order
   * entry ("2") and a project's current id ("2-noteease") both reduce to
   * the same leading token, so a project rename can never silently bump it
   * to the end of the list just because the stored array wasn't migrated.
   */
  sortProjectIds(defaultIds: string[]): string[] {
    const explicit = this.order$.value
      .map((storedId) => defaultIds.find((id) => extractProjectId(id) === extractProjectId(storedId)))
      .filter((id): id is string => id !== undefined);
    const missing = defaultIds.filter((id) => !explicit.includes(id));
    return [...explicit, ...missing];
  }

  async setOrder(ids: string[], accessToken: string): Promise<void> {
    await ensureFirebaseAuth(accessToken);
    // Defensive: never let a bad/undefined entry reach Firestore, where it
    // silently becomes `null` in the stored array instead of being
    // rejected outright (see subscribeOrder for the read-side version of
    // this same guard).
    const cleaned = ids.filter((id): id is string => typeof id === 'string' && id.length > 0);
    await setDoc(doc(this.db, ORDER_COLLECTION, ORDER_DOC_ID), { ids: cleaned });
  }

  /**
   * One-time cosmetic cleanup: rewrites the stored order array so it holds
   * the projects' *current* (readable) ids instead of stale legacy ones —
   * purely for readability when looking at the raw Firestore doc; ordering
   * already works correctly either way via the token-matching in
   * sortProjectIds(). Safe to call repeatedly — a no-op once nothing in
   * the stored array is stale.
   */
  async renameOrderIds(currentProjectIds: string[], accessToken: string): Promise<void> {
    const stored = this.order$.value;
    if (stored.length === 0) {
      return;
    }

    const renamed = stored.map(
      (storedId) => currentProjectIds.find((id) => extractProjectId(id) === extractProjectId(storedId)) ?? storedId
    );

    if (renamed.join(',') === stored.join(',')) {
      return;
    }

    await this.setOrder(renamed, accessToken);
  }

  /**
   * Firestore's security rules — not this method — enforce that only the
   * owner can write here; a non-owner calling this gets a
   * permission-denied error from Firestore itself.
   */
  async setState(
    projectId: string,
    title: string,
    state: ProjectVisibilityState,
    accessToken: string
  ): Promise<void> {
    await ensureFirebaseAuth(accessToken);
    const baseId = extractProjectId(projectId);
    const id = buildDocId(baseId, title);
    await setDoc(doc(this.db, COLLECTION_NAME, id), state);

    // Self-heals docs written before named IDs existed (plain "1", "2", ...)
    // — deleteDoc on a doc that doesn't exist is a no-op, not an error.
    if (baseId !== id) {
      await deleteDoc(doc(this.db, COLLECTION_NAME, baseId));
    }
  }
}
