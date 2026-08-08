/**
 * Google OAuth Configuration
 *
 * Reuses the same OAuth 2.0 Client ID as the E-conomic project, since the
 * long-term plan is to merge that app into this site behind this login.
 * Get it from: https://console.cloud.google.com/ -> Credentials -> OAuth 2.0 Client ID
 *
 * Scopes are split into two tiers, requested at different times
 * (Google's "incremental authorization" pattern):
 *
 * - BASIC_SCOPES: requested for the site's own login. Plain identity
 *   scopes, not in Google's "sensitive"/"restricted" tiers, so anyone can
 *   complete login with no consent-screen verification friction.
 * - SHEETS_SCOPES: requested as a second, separate consent step, only
 *   when an allowed user actually opens /dashboard/economic. These ARE
 *   sensitive/restricted, so only manually-added "Test users" (or
 *   accounts after full app verification) can grant them — but that
 *   restriction no longer blocks basic site login for everyone else.
 */
export const GOOGLE_CONFIG = {
  CLIENT_ID: '520118713358-m78lld03h4vsau42pt218dec2mccv9to.apps.googleusercontent.com',

  BASIC_SCOPES: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ],

  SHEETS_SCOPES: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
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

