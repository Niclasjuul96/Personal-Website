/**
 * Google OAuth Configuration
 *
 * Reuses the same OAuth 2.0 Client ID as the E-conomic project, since the
 * long-term plan is to merge that app into this site behind this login.
 * Get it from: https://console.cloud.google.com/ -> Credentials -> OAuth 2.0 Client ID
 */
export const GOOGLE_CONFIG = {
  CLIENT_ID: '520118713358-m78lld03h4vsau42pt218dec2mccv9to.apps.googleusercontent.com',

  // Sheets/Drive scopes needed by the merged E-conomic feature, plus the
  // original identity scopes for login itself.
  SCOPES: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ],

  // API key for the Google Picker ("Select from Drive" in E-conomic).
  // Restricted to this site's origins and to the Picker + Drive APIs
  // in Google Cloud Console.
  API_KEY: 'AIzaSyCkEE1O3FKKwW52mA4GrIHcXj3QQkad5XI',
};

/**
 * Google Sheets configuration for the merged E-conomic feature.
 * Ported from E-conomic/frontend/src/app/constants/google-config.ts.
 */
export const SHEET_CONFIG = {
  STORAGE_KEY: 'e_conomic_sheet_id',
  TRANSACTIONS_SHEET_NAME: 'Transactions',
  HEADER_ROW_NUMBER: 1,
  HEADERS: [
    'Date',
    'Title',
    'Amount',
    'MainCategory',
    'SubCategory',
    'Month',
    'Year',
    'Timestamp',
  ],
};

// Google accounts allowed to see gated pages (Dashboard, E-conomic).
// Anyone can sign in, but only these emails get past the allowed guard.
// Add/remove emails here and redeploy to change who has access.
export const ALLOWED_EMAILS = ['Niclasschaeffer96@gmail.com'];
