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
import { FirebaseStorage, getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseApp } from './firebase-app';
import { ensureFirebaseAuth } from './firebase-auth-bridge';
import { buildDocId } from './project-id-slug';

export interface ProjectRecord {
  id: string;
  title: string;
  imgURL: string;
  detail: string;
  githuburl: string;
  livepreviewurl?: string;
  tech: string[];
  accounts?: string[];
  /** Show livepreviewurl inline via an iframe in the Portfolio modal, instead of only linking out. Requires the target host to allow framing (no X-Frame-Options/frame-ancestors block). */
  embeddable?: boolean;
}

export type ProjectInput = Omit<ProjectRecord, 'id'>;

const COLLECTION_NAME = 'projects';

/**
 * Firestore's setDoc()/addDoc() reject any field whose value is literally
 * `undefined` (as opposed to the key being absent, which is fine) —
 * optional fields like `accounts` end up `undefined` after the admin
 * form's edit flow round-trips a project that never had one. Stripping
 * them here means callers don't have to remember to omit vs. null every
 * optional field by hand.
 */
function stripUndefined<T extends object>(input: T): T {
  const result = {} as T;
  for (const key of Object.keys(input) as (keyof T)[]) {
    if (input[key] !== undefined) {
      result[key] = input[key];
    }
  }
  return result;
}

/**
 * The 5 projects that used to be hardcoded in cv-profile.ts, written under
 * their original ids ("1"-"5") the one time the Projects collection is
 * still empty — so the projectVisibility/projectOrder data that already
 * exists for these same ids (from before this feature) keeps working with
 * zero migration needed there. Anything added later via the admin UI gets
 * a normal Firestore auto-generated id instead.
 */
const SEED_PROJECTS: Record<string, ProjectInput> = {
  '1': {
    title: 'Chat-App',
    imgURL: 'assets/project-images/Chat-App.png',
    detail:
      'This chat application is based on react and using firebase as the backend to track messages back and forth between users. It is available to use the existing accounts or creating a new account. It will be possible to find the users by thier firstName, upper and lowercase dosn\'t matter. for the real experience i would recommend to create an account and searching for users. cause many of the test users already have conversations between them.',
    githuburl: 'https://github.com/Niclasjuul96/Chat-App',
    livepreviewurl: 'http://chatapp.niclasjuul.dk/',
    tech: ['react', 'javascript', 'node.js', 'json', 'firebase'],
    accounts: [
      'Account 1: jimmy@gmail.com, pass: password',
      'Account 2: jenna@gmail.com, pass: password',
      'Account 3: jennifer@gmail.com, pass: password',
      'Account 4: peter@gmail.com pass: password'
    ]
  },
  '2': {
    title: 'NoteEase',
    imgURL: 'assets/project-images/NoteEase.png',
    detail:
      'NoteEase was one of my first projects, that i was doing while learning react. a simple note taking app that is saving your notes to remember for another time, i am using json and local storage to retrieve and save notes and able to delete aswell',
    githuburl: 'https://github.com/Niclasjuul96/NoteEase',
    livepreviewurl: 'http://noteease.niclasjuul.dk/',
    tech: ['react', 'javascript', 'node.js', 'json']
  },
  '3': {
    title: 'Simon Says Game',
    imgURL: 'assets/project-images/SimonGame.png',
    detail:
      'Simon game was a little funny project that i was testing if i would be able to do. it\'s just envolving the basic html, css and javascript.',
    githuburl: 'https://github.com/Niclasjuul96/SimonGame',
    livepreviewurl: 'http://simongame.niclasjuul.dk/',
    tech: ['Html', 'CSS', 'JavaScript']
  },
  '4': {
    title: 'Password Generator',
    imgURL: 'assets/project-images/password.png',
    detail:
      'Password generator is a small and simple tool to generate password that includes what ever you like. to solve solve one of the hardest stuff in life, finding a password to use. and ofc the copy to clipboard doesn\'t work on the website cause it\'s not possible. but iif you download the project from github, you will be able to use that feature aswell.',
    githuburl: 'https://github.com/Niclasjuul96/PasswordGenerator/',
    livepreviewurl: 'http://passwordgenerator.niclasjuul.dk/',
    tech: ['html', 'CSS', 'JavaScript']
  },
  '5': {
    title: 'KanBan Board',
    imgURL: 'assets/project-images/KanBan.png',
    detail:
      'This small kanban board project is based on console application, and coordination through tublespaces. Able to work around with the application at the same time without interfering with others. The live-preview will not work, so if you wanna look how it works, you will need to go to github and clone it.',
    githuburl: 'https://github.com/Niclasjuul96/KanBan',
    livepreviewurl: '',
    tech: ['Java', 'Tublespaces']
  }
};

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private db: Firestore = getFirestore(getFirebaseApp());
  private storage: FirebaseStorage = getStorage(getFirebaseApp());

  private projects$ = new BehaviorSubject<ProjectRecord[]>([]);
  private loaded$ = new BehaviorSubject<boolean>(false);

  /** Live list of every project — the Portfolio page's and admin UI's source of truth. */
  projects = this.projects$.asObservable();

  /** True once the initial Firestore read has completed (success or failure). */
  loaded = this.loaded$.asObservable();

  constructor() {
    // Same deferred-subscribe pattern used everywhere else in this app —
    // subscribing synchronously in the constructor races Firestore's own
    // internal client startup and can bounce off a fully public rule with
    // permission-denied, which onSnapshot never retries.
    setTimeout(() => this.subscribe(), 0);
  }

  private subscribe(): void {
    onSnapshot(
      collection(this.db, COLLECTION_NAME),
      (snapshot) => {
        this.projects$.next(
          snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as ProjectInput) }))
        );
        this.loaded$.next(true);
      },
      (error) => {
        console.error('[Projects] Failed to load projects:', error);
        this.loaded$.next(true);
      }
    );
  }

  /**
   * Called once from the admin page after a real load has confirmed the
   * collection is empty — mirrors AllowedUsersService.ensureOwnerBootstrapped.
   * A no-op forever after the first successful seed.
   */
  async ensureSeeded(accessToken: string): Promise<void> {
    if (!this.loaded$.value || this.projects$.value.length > 0) {
      return;
    }

    await ensureFirebaseAuth(accessToken);
    await Promise.all(
      Object.entries(SEED_PROJECTS).map(([id, project]) =>
        setDoc(doc(this.db, COLLECTION_NAME, id), project)
      )
    );
  }

  /**
   * Firestore's security rules — not this method — enforce that only the
   * owner can write here; a non-owner calling this gets a
   * permission-denied error from Firestore itself.
   *
   * Doc id is "<reservedId>-<slug-of-title>" (e.g. "k3f9s2-my-project") —
   * `doc(collection(...))` reserves a fresh unique id without writing
   * anything, which then doubles as the stable base id (same "readable but
   * still keyed off a unique leading token" scheme as the seeded legacy
   * projects below), instead of addDoc()'s opaque random id.
   */
  async addProject(input: ProjectInput, accessToken: string): Promise<void> {
    await ensureFirebaseAuth(accessToken);
    const reservedId = doc(collection(this.db, COLLECTION_NAME)).id;
    const id = buildDocId(reservedId, input.title);
    await setDoc(doc(this.db, COLLECTION_NAME, id), stripUndefined(input));
  }

  async updateProject(id: string, input: ProjectInput, accessToken: string): Promise<void> {
    await ensureFirebaseAuth(accessToken);
    await setDoc(doc(this.db, COLLECTION_NAME, id), stripUndefined(input));

    // Self-heals ids written before this scheme existed (plain "1", "2",
    // ...) — the next edit of a legacy project renames it to "<id>-<slug>"
    // and cleans up the old bare doc. deleteDoc on a doc that doesn't
    // exist is a no-op, not an error.
    const readableId = buildDocId(id, input.title);
    if (/^\d+$/.test(id) && readableId !== id) {
      await setDoc(doc(this.db, COLLECTION_NAME, readableId), stripUndefined(input));
      await deleteDoc(doc(this.db, COLLECTION_NAME, id));
    }
  }

  async deleteProject(id: string, accessToken: string): Promise<void> {
    await ensureFirebaseAuth(accessToken);
    await deleteDoc(doc(this.db, COLLECTION_NAME, id));
  }

  /**
   * Renames every project still sitting under a legacy bare-numeric id
   * ("1".."5", from before readable ids existed) to "<id>-<slug>", same
   * scheme as addProject/updateProject. Called once from the admin page on
   * load — safe to call repeatedly, a no-op once nothing legacy is left.
   */
  async renameLegacyIds(accessToken: string): Promise<void> {
    const legacy = this.projects$.value.filter((p) => /^\d+$/.test(p.id));
    if (legacy.length === 0) {
      return;
    }

    await ensureFirebaseAuth(accessToken);
    await Promise.all(
      legacy.map(async ({ id, ...input }) => {
        const readableId = buildDocId(id, input.title);
        if (readableId === id) {
          return;
        }
        await setDoc(doc(this.db, COLLECTION_NAME, readableId), stripUndefined(input));
        await deleteDoc(doc(this.db, COLLECTION_NAME, id));
      })
    );
  }

  /** Uploads a project image to Firebase Storage and resolves with its public download URL. */
  async uploadImage(file: Blob, filename: string, accessToken: string): Promise<string> {
    await ensureFirebaseAuth(accessToken);
    const path = `project-images/${Date.now()}-${filename}`;
    const imageRef = ref(this.storage, path);
    await uploadBytes(imageRef, file);
    return getDownloadURL(imageRef);
  }

  /**
   * Fetches a project's current image (typically a static asset already
   * served from this same site, e.g. assets/project-images/Chat-App.png)
   * and re-uploads it to Storage — same-origin fetch, so no CORS issue —
   * so every project's image can end up living in the same place instead
   * of some pointing at static assets and others at Storage.
   */
  async migrateImageToStorage(imgURL: string, accessToken: string): Promise<string> {
    const response = await fetch(imgURL);
    if (!response.ok) {
      throw new Error(`Failed to fetch existing image (${response.status})`);
    }
    const blob = await response.blob();
    const filename = imgURL.split('/').pop() || 'image';
    return this.uploadImage(blob, filename, accessToken);
  }
}
