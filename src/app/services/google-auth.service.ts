import { Injectable, NgZone, inject } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { GOOGLE_CONFIG } from '../constants/google-config';
import { AllowedUsersService } from './allowed-users.service';

declare global {
  interface Window {
    google: any;
  }
}

const STORAGE_KEYS = {
  accessToken: 'website_google_access_token',
  expiresAt: 'website_google_token_expires_at',
  userName: 'website_google_user_name',
  userPicture: 'website_google_user_picture',
  userEmail: 'website_google_user_email',
};

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private allowedUsers = inject(AllowedUsersService);

  private isInitialized$ = new BehaviorSubject<boolean>(false);
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private userName$ = new BehaviorSubject<string | null>(null);
  private userPicture$ = new BehaviorSubject<string | null>(null);
  private userEmail$ = new BehaviorSubject<string | null>(null);
  private tokenClient: any = null;
  private initAttempted = false;

  isAuthenticated = this.isAuthenticated$.asObservable();
  isInitialized = this.isInitialized$.asObservable();
  userName = this.userName$.asObservable();
  userPicture = this.userPicture$.asObservable();
  userEmail = this.userEmail$.asObservable();

  /**
   * Role lookups are driven by the live Firestore-backed allowlist
   * (AllowedUsersService), not a compile-time constant — so these need
   * to react to both "who's logged in" and "the allowlist just changed"
   * (e.g. the owner added someone while this tab is open).
   */
  userRole = combineLatest([this.userEmail$, this.allowedUsers.users]).pipe(
    map(([email]) => this.allowedUsers.getRole(email))
  );

  /** True for any account in the allowlist, regardless of role. */
  isAllowed = this.userRole.pipe(map((role) => role !== null));

  /** True only for the 'owner' role specifically. */
  isOwner = this.userRole.pipe(map((role) => role === 'owner'));

  constructor(private ngZone: NgZone) {
    // Restoring a previous session is pure localStorage reading, so it
    // doesn't need to wait on the Google SDK (only login()/logout() do).
    this.checkStoredToken();
    setTimeout(() => this.initWhenReady(), 0);
  }

  isCurrentlyAuthenticated(): boolean {
    return this.isAuthenticated$.value;
  }

  isCurrentlyAllowed(): boolean {
    return this.allowedUsers.getRole(this.userEmail$.value) !== null;
  }

  isCurrentlyOwner(): boolean {
    return this.allowedUsers.getRole(this.userEmail$.value) === 'owner';
  }

  private initWhenReady(): void {
    if (this.initAttempted) {
      return;
    }

    if (this.isGoogleReady()) {
      this.initializeTokenClient();
      return;
    }

    let attempts = 0;
    const maxAttempts = 150; // 150 * 200ms = 30 seconds

    const interval = setInterval(() => {
      attempts++;

      if (this.isGoogleReady()) {
        clearInterval(interval);
        this.initializeTokenClient();
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.error('[GoogleAuth] Timeout: Google did not load within 30 seconds');
        this.isInitialized$.next(false);
      }
    }, 200);
  }

  private isGoogleReady(): boolean {
    try {
      return (
        window.google &&
        window.google.accounts &&
        window.google.accounts.oauth2 &&
        typeof window.google.accounts.oauth2.initTokenClient === 'function'
      );
    } catch {
      return false;
    }
  }

  private initializeTokenClient(): void {
    if (this.initAttempted) {
      return;
    }

    this.initAttempted = true;

    if (!this.isGoogleReady()) {
      console.error('[GoogleAuth] Google is not ready at initialization time');
      this.isInitialized$.next(false);
      return;
    }

    try {
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CONFIG.CLIENT_ID,
        scope: GOOGLE_CONFIG.SCOPES.join(' '),
        callback: (response: any) => this.handleTokenResponse(response),
      });

      this.isInitialized$.next(true);
    } catch (error) {
      console.error('[GoogleAuth] Failed to initialize token client:', error);
      this.isInitialized$.next(false);
    }
  }

  /**
   * Initiate OAuth login flow (shows Google consent screen)
   */
  login(): void {
    if (!this.tokenClient) {
      console.error('[GoogleAuth] Token client not initialized');
      return;
    }

    this.tokenClient.requestAccessToken({ prompt: 'consent' });
  }

  logout(): void {
    const token = localStorage.getItem(STORAGE_KEYS.accessToken);
    if (token && window.google?.accounts?.oauth2) {
      // revoke()'s callback is another Google SDK callback outside
      // Angular's zone — same reasoning as handleTokenResponse.
      window.google.accounts.oauth2.revoke(token, () => this.ngZone.run(() => this.clearSession()));
    } else {
      this.clearSession();
    }
  }

  private clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.expiresAt);
    localStorage.removeItem(STORAGE_KEYS.userName);
    localStorage.removeItem(STORAGE_KEYS.userPicture);
    localStorage.removeItem(STORAGE_KEYS.userEmail);
    this.isAuthenticated$.next(false);
    this.userName$.next(null);
    this.userPicture$.next(null);
    this.userEmail$.next(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.accessToken);
  }

  private checkStoredToken(): void {
    const token = localStorage.getItem(STORAGE_KEYS.accessToken);
    const expiresAt = localStorage.getItem(STORAGE_KEYS.expiresAt);

    if (token && expiresAt && new Date().getTime() < parseInt(expiresAt, 10)) {
      this.isAuthenticated$.next(true);
      this.userName$.next(localStorage.getItem(STORAGE_KEYS.userName));
      this.userPicture$.next(localStorage.getItem(STORAGE_KEYS.userPicture));
      this.userEmail$.next(localStorage.getItem(STORAGE_KEYS.userEmail));
    }
  }

  private handleTokenResponse(response: any): void {
    if (response.error !== undefined) {
      console.error('[GoogleAuth] OAuth error:', response.error);
      return;
    }

    const accessToken = response.access_token;
    const expiresIn = response.expires_in || 3600;
    const expiresAt = new Date().getTime() + expiresIn * 1000;

    localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
    localStorage.setItem(STORAGE_KEYS.expiresAt, expiresAt.toString());

    // Google's SDK invokes this callback outside Angular's zone (it's
    // triggered by the popup window, not a zone-patched browser API), so
    // BehaviorSubject updates here wouldn't trigger change detection —
    // the view would only catch up on the next unrelated render (e.g. a
    // manual refresh) without this.
    this.ngZone.run(() => this.isAuthenticated$.next(true));
    this.fetchUserInfo(accessToken);
  }

  private fetchUserInfo(accessToken: string): void {
    fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        const givenName = data.given_name || 'User';
        const familyName = data.family_name || '';
        const fullName = `${givenName} ${familyName}`.trim();
        const picture = data.picture || null;
        const email = data.email || null;

        // Same reasoning as above: this chains off the token callback's
        // zone, so force it back into Angular's zone explicitly rather
        // than assuming it propagated.
        this.ngZone.run(() => {
          this.userName$.next(fullName);
          this.userPicture$.next(picture);
          this.userEmail$.next(email);
        });
        localStorage.setItem(STORAGE_KEYS.userName, fullName);
        if (picture) {
          localStorage.setItem(STORAGE_KEYS.userPicture, picture);
        }
        if (email) {
          localStorage.setItem(STORAGE_KEYS.userEmail, email);
          // No-op after the allowlist has its first entry — only matters
          // the very first time the bootstrap owner logs in.
          this.allowedUsers.ensureOwnerBootstrapped(email, accessToken);
        }
      })
      .catch((error) => {
        console.error('[GoogleAuth] Failed to fetch user info:', error);
      });
  }
}
