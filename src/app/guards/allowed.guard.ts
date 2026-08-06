import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GoogleAuthService } from '../services/google-auth.service';

/**
 * Session restore is synchronous (localStorage-based, see GoogleAuthService),
 * so allowed-status is already known by the time this guard runs on navigation.
 */
export const allowedGuard: CanActivateFn = () => {
  const googleAuth = inject(GoogleAuthService);
  const router = inject(Router);

  return googleAuth.isCurrentlyAllowed() || router.createUrlTree(['/']);
};
