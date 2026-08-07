import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { GoogleAuthService } from '../services/google-auth.service';
import { AllowedUsersService } from '../services/allowed-users.service';

/**
 * Same async-wait reasoning as allowedGuard — the allowlist (and
 * therefore role info) loads from Firestore asynchronously, so this
 * waits for that initial load before deciding.
 */
export const ownerGuard: CanActivateFn = () => {
  const googleAuth = inject(GoogleAuthService);
  const allowedUsers = inject(AllowedUsersService);
  const router = inject(Router);

  return allowedUsers.loaded.pipe(
    filter((loaded) => loaded),
    take(1),
    map(() => googleAuth.isCurrentlyOwner() || router.createUrlTree(['/']))
  );
};
