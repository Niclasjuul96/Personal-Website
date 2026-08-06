/**
 * Google OAuth Configuration
 *
 * Reuses the same OAuth 2.0 Client ID as the E-conomic project, since the
 * long-term plan is to merge that app into this site behind this login.
 * Get it from: https://console.cloud.google.com/ -> Credentials -> OAuth 2.0 Client ID
 */
export const GOOGLE_CONFIG = {
  CLIENT_ID: '520118713358-m78lld03h4vsau42pt218dec2mccv9to.apps.googleusercontent.com',

  // Identity only for now. Sheets/Drive scopes get added when E-conomic is merged in.
  SCOPES: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ],
};

// Google accounts allowed to see gated pages (Dashboard, E-conomic).
// Anyone can sign in, but only these emails get past the allowed guard.
// Add/remove emails here and redeploy to change who has access.
export const ALLOWED_EMAILS = ['Niclasschaeffer96@gmail.com'];
