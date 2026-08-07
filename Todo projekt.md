# Todo / Roadmap

Original note: Merge Economics ind i hjemmeside, da jeg vil tilføje login
funktionalitet således jeg kan tilgå budget igennem min hjemmeside.

## Vision

Turn the personal website into the single entry point for Niclas's own
tools. Log in with Google once on the site, and it unlocks personal
apps/pages that visitors don't see — starting with E-conomic (budget
tracker), more later.

## Current state (as of 2026-08-06)

- Google login is live in the header (`Sign in with Google` button).
  - Uses Google Identity Services' OAuth2 token client, not Google One Tap.
  - Reuses the **same OAuth Client ID as the E-conomic project**
    (`520118713358-...apps.googleusercontent.com`), since the plan is to
    merge the two anyway. Registered origins: `http://localhost:4200` and
    `https://niclasjuul.dk`.
  - Session persisted in `localStorage` (access token, name, picture, email).
  - `GOOGLE_CONFIG.SCOPES` now includes Sheets + Drive scopes (not just
    identity) — extended when E-conomic was merged in, see below.
- `ALLOWED_EMAILS` allowlist (`src/app/constants/google-config.ts`) gates
  access to owner-only pages. Anyone can log in; only listed emails see
  gated content. Add/remove emails there and redeploy to change access —
  no UI for this yet (decided against a live settings page for now since
  it'd require standing up a backend).
- `/dashboard` route exists, guarded by `allowedGuard`
  (`src/app/guards/allowed.guard.ts`), redirects non-allowed users home.
  Welcome message + an E-conomic card linking into the real merged feature.
- **E-conomic is merged in and working**, at `/dashboard/economic`
  (also guarded by `allowedGuard`). See the dedicated section below for
  what was ported and the decisions made along the way.
- Key files:
  - `src/app/constants/google-config.ts` — Client ID, scopes, ALLOWED_EMAILS, SHEET_CONFIG
  - `src/app/services/google-auth.service.ts` — auth state, login/logout
  - `src/app/guards/allowed.guard.ts` — route protection
  - `src/app/pages/dashboard/` — the gated dashboard page
  - `src/app/pages/dashboard/economic/` — the merged E-conomic feature
  - `src/app/header/` — login button / user badge / access badges / Dashboard nav link

## Important architecture decision: what "allowed" actually protects

The `ALLOWED_EMAILS` check is a **client-side UX gate**, not a real security
boundary — the compiled JS bundle is public, so the email list itself is
readable by anyone who looks (not a secret), and a technical visitor could
in theory fake their way past the client-side check in their own browser.
That's fine as long as gated pages don't hold real data client-side.

The actual security, once E-conomic's data is involved, comes from
**Google's own per-file Sheets/Drive permissions**: API calls use the
logged-in user's own OAuth token, which can only read files Google has
granted that specific account access to. Someone bypassing the app's UI
gate still can't read Niclas's budget sheet unless Google itself would let
their account open that file. Revisit this if a future feature needs data
that ISN'T already protected by Google's own ACLs.

## Next steps (not yet started)

- [x] ~~Decide how E-conomic actually gets merged in~~ — decided
      2026-08-06: native merge, not iframe.
- [x] ~~Extend GOOGLE_CONFIG.SCOPES, port E-conomic in, replace the Coming
      soon card~~ — **done 2026-08-06, see dedicated section below.**
- [ ] Longer-term/maybe: a real backend if any future feature needs
      server-side authorization instead of relying on Google's own ACLs.
- [ ] **Decided 2026-08-07, not started: split login into two OAuth
      steps.** Real bug found while testing with a second account: the
      site's OAuth Client ID requests *all* scopes at once, including
      Sheets/Drive (Google's "sensitive"/"restricted" tiers) — so Google
      itself blocks anyone not manually added as a "Test user" in the
      OAuth consent screen from completing login at all, before the
      app's own `ALLOWED_USERS` check ever runs. This directly breaks
      the original intent ("anyone can log in, gets a friendly 'No
      access' badge if not allowed") — right now strangers can't even
      log in to see that badge.

      **Decided fix:** split the one token request into two. Request
      only basic scopes (email/profile) for the site's own login —
      publishable with no verification friction since it's not
      sensitive. Request Sheets/Drive scopes as a *second*, separate
      consent step (Google's "incremental authorization" pattern) only
      when an allowed user actually opens `/dashboard/economic`. Site
      login becomes truly open again; only the smaller group who use
      E-conomic ever hits the heavier scopes/test-user gate.

      Real architectural change to `GoogleAuthService`'s token request
      flow (one `initTokenClient`/`requestAccessToken` call becomes two,
      triggered at different times) — not a quick tweak, deliberately
      not started yet. Next session.

      Considered alternatives, not chosen: full Google app verification
      (restores the same thing, but a real process — security assessment
      for the restricted `drive` scope — overkill for a personal site);
      leaving it as-is (simplest, but "anyone can log in" stays false,
      just you + manually-added test users).
- [x] ~~Clone the other side projects down into the local coding folder~~
      — **done 2026-08-06.** Cloned: `Chat-App`, `NoteEase`,
      `PasswordGenerator`, `SimonGame`. **`KanBan` was not cloned** —
      still only referenced via its GitHub link in `cv-profile.ts`, not
      present locally. Clone it too whenever it's needed.

## Done: E-conomic native merge — completed 2026-08-06

E-conomic's Angular components, services, and models are now ported into
Personal-Website at `src/app/pages/dashboard/economic/`, mirroring
E-conomic's own internal folder structure (`components/`, `services/`,
`constants/`, `models/`). Route is `/dashboard/economic`, lazy-loaded via
`loadComponent` (confirmed in the build output as its own
`economic-component` chunk, ~161 kB, separate from `main.js` — visitors
who never open it never download that weight) and guarded by the same
`allowedGuard` as `/dashboard`.

**Key decisions made while porting:**

- **Auth was reconciled, not duplicated.** E-conomic had its own
  `GoogleAuthService`; this site already has one. Checked what E-conomic's
  `GoogleSheetsService` and `sheet-selector` component actually needed from
  it — just `isAuthenticated` and `getAccessToken()`, which already exist
  identically on this site's service — so the ported files import this
  site's `GoogleAuthService` directly instead of bringing E-conomic's
  copy along. Zero logic changes needed to make that work.
- **Stripped E-conomic's own login/logout header UI** from the ported root
  component (`economic.component.html`) — it's redundant now, since the
  site's own header already handles login globally and the route guard
  already ensures only logged-in, allowed users reach this page.
- **Restyled to match the cyberpunk design system — done 2026-08-06,**
  as a deliberate follow-up once the merge was working functionally.
  All five component stylesheets (`economic.component.scss`,
  `csv-upload.scss`, `budget-table.scss`, `transaction-details.scss`, and
  `sheet-selector`'s styles) converted from E-conomic's original light/
  blue theme to the site's dark neon palette via
  `@use '.../styles/cyberpunk-design' as *`, reusing existing mixins
  (`glass-morphism`, `neon-glow`, `no-jump-hover`) rather than inventing
  new patterns. `sheet-selector` was also split from inline
  `template`/`styles` into external `.html`/`.scss` files (matching
  every other ported component) since inline component styles in this
  project are plain CSS, not Sass, so `@use` wasn't available there
  otherwise.

  **Color mapping chosen:** neon-cyan for primary actions/headings
  (matching the rest of the site), neon-lime for positive values and
  "go" actions (Create Sheet, Confirm), neon-magenta for negative values
  and errors — reusing the same lime=good/magenta=restricted semantic
  already established by the header's "Access granted"/"No access"
  badges, rather than introducing new colors.

  Verified via computed styles (no light-theme backgrounds/colors
  remained anywhere) since a real screenshot wasn't available in this
  session — worth a quick visual look yourself to confirm it actually
  reads well, especially contrast on the budget table's small text.
- **Four real issues found and fixed 2026-08-06, from actually using it:**
  the first two were pre-existing in E-conomic's original code, not
  introduced by the merge — the port just carried them along faithfully.
  1. **New CSV uploads replaced everything instead of adding to it.**
     `mergeTransactions()` in `economic.component.ts` was a stub — despite
     its name and a comment claiming otherwise, it just returned the
     newly parsed rows and silently discarded whatever was already
     loaded. `handleCsvParsed()` also read the budget totals straight off
     the parser's output for the new file alone, rather than
     re-aggregating from the full transaction list. Symptom: only the
     just-uploaded file's data showed on screen until a page reload
     re-fetched everything from Sheets. Fixed both: `mergeTransactions`
     now actually merges + dedupes (same `date|title|amount|category` key
     already used elsewhere for this), and `handleCsvParsed` calls the
     existing `aggregateTransactions()` helper afterward instead of using
     the parser's file-scoped totals directly.
  2. **New transactions always landed at the bottom of the Transactions
     sheet, unsorted.** `GoogleSheetsService.appendTransactions` used
     Sheets' `values:append` API, which always inserts after the last row
     with data regardless of date. Sorting the column natively in Sheets
     wouldn't have helped either — dates are stored as plain "DD.MM.YYYY"
     text (RAW input mode skips Sheets' own date parsing), and day-first
     text doesn't sort chronologically as a string. Fixed by merging +
     sorting chronologically in JS (added a `parseTransactionDate` helper
     using the same date-parsing convention already used elsewhere in the
     file) and rewriting the whole data range with `values.update` (PUT)
     instead of appending. Confirmed working by Niclas with two real CSV
     imports (import, delete, import a different file) — rows sort
     correctly now.
  3. **Numbers were getting cut off with "..." in the budget table.**
     Introduced by the *original* E-conomic CSS, not the restyle — value
     columns were hardcoded to 60px with `text-overflow: ellipsis`, fine
     for small mock numbers but too narrow for real formatted amounts
     like `-1.234,56` or a yearly total like `240.000,00`. Since this is
     a budget table, silently truncating a number is a correctness
     problem, not just a cosmetic one. Widened value columns to 110px
     (table `min-width` scaled up to match, still horizontally
     scrollable), removed the ellipsis/overflow-hiding from value cells
     entirely (kept it only on the category-name column, where
     truncating long text is reasonable). Verified with a realistic
     6-figure amount (`245.678,90`) rendering fully with no clipping
     (`scrollWidth <= clientWidth`).
  4. **Negative/expense values looked purple, not red.** From the
     restyle pass, not a bug — `$neon-magenta` (`#ff00ff`, true magenta)
     was chosen for negative values, and it reads as purple. Swapped to
     `$neon-pink` (`#ff006e`), a redder tone already defined in the
     design system but previously unused anywhere on the site. Scoped
     narrowly to `budget-table.scss` and `transaction-details.scss` (the
     actual expense/negative-amount coloring) — deliberately left
     `$neon-magenta` alone everywhere else (header's "No access" badge,
     "Coming soon" badges, sync/error states), since those represent a
     different concept (restricted access, sync failure) than "this is
     an expense," and weren't what was flagged. Verified the rendered
     color is `rgb(255, 0, 110)` (`#ff006e`) after a hard reload — an
     HMR update briefly showed the stale color first, not a real bug,
     just needed a fresh page load to pick up the new stylesheet.
- **Added two things to the whole app that E-conomic needed:**
  - `apis.google.com/js/api.js` script in `index.html` (Google Picker API,
    used by the sheet-selector's "Select from Drive" button).
  - `registerLocaleData(localeDa)` in `main.ts`, needed because the budget
    tables format numbers with an explicit `'da-DK'` locale argument.
    Deliberately did NOT change the site's global `LOCALE_ID` — the
    pipes already specify the locale explicitly per-use, so nothing else
    on the site is affected.
- **One real type-checking difference** surfaced between the two Angular
  projects (19 vs. 20): a `typeof val === 'number' && val > 0` pattern
  inside an `[ngClass]` object literal type-checked fine in E-conomic but
  not here — Angular's template compiler didn't narrow the type the same
  way. Fixed with `$any(val)` casts in `budget-table.html`; purely a
  type-checking workaround, no behavior change.
- **Tested with a real Google account, 2026-08-06 (post-merge follow-up):**
  logging in and reaching `/dashboard/economic` works for real, not just
  simulated. Confirmed the scope change forced a fresh consent screen as
  expected.
- **Fixed the Google Picker gap flagged right after the merge:** the
  ported `sheet-selector.ts` had `getDeveloperKey()` hardcoded to return
  `''` (carried over from E-conomic, which never wired this up either) —
  this caused a real "you don't have access to this page" error from
  Google Drive when trying "Select from Drive". Root cause: the Picker
  needs its own **API key** credential (separate from the OAuth Client
  ID), with the Google Picker API *and* Google Drive API enabled and
  restricted to this site's origins. Created that key, added it as
  `GOOGLE_CONFIG.API_KEY` in `google-config.ts`, wired `getDeveloperKey()`
  to read from it, and added a clearer in-app error message (pointing to
  "Link existing sheet" as a manual fallback) for if the key's ever
  missing again. **Confirmed working — selecting a sheet from Drive now
  succeeds.**
- **Still not exercised:** the full CSV import → Sheets sync → budget
  table rendering flow with real transaction data. Worth a full pass
  through that soon.

## Done: roles (owner vs. allowed) — built 2026-08-07

`ALLOWED_EMAILS: string[]` is gone, replaced by
`ALLOWED_USERS: AllowedUser[]` in `google-config.ts`, where
`AllowedUser = { email: string; role: Role }` and
`Role = 'owner' | 'member'`. Currently just Niclas as `'owner'` — no
`'member'` accounts exist yet, but the shape supports them today.

**Built with adaptability as the explicit goal, per Niclas's ask:**

- **One source of truth.** A single `getUserRole(email): Role | null`
  helper in `google-auth.service.ts` looks up `ALLOWED_USERS`; every
  other check (`isEmailAllowed`, `isEmailOwner`) derives from it instead
  of re-implementing the lookup. Adding a role check later (e.g.
  `isEmailEditor`) means writing one line that calls `getUserRole`, not
  duplicating the array-search logic again.
- **`Role` is a plain string union**, not an enum or a hardcoded pair of
  booleans — adding a third role is a one-line type change
  (`'owner' | 'member' | 'editor'`), and TypeScript will then flag every
  `switch` on `Role` that doesn't handle the new case.
- **Both the specific and the general are exposed.** `GoogleAuthService`
  now has `userRole` (the actual role, or `null`) alongside the
  convenience `isAllowed`/`isOwner` observables (and matching
  `isCurrentlyAllowed()`/`isCurrentlyOwner()` sync methods). Consumers
  that only care about "is this the owner" use `isOwner`; a future
  feature that needs to distinguish more roles can read `userRole`
  directly instead of waiting for a new convenience property to be added
  for it.

**Deliberately not built yet:** no owner-only UI exists to actually gate
with `isOwner` — that arrives with the project-visibility toggle, which
needs the Firebase backend (see below) to work across visitors, not just
the owner's own browser. This was purely the access-control groundwork,
ready for that feature to consume once built.

Verified via the live service instance in the browser: owner email →
`isAllowed: true, isOwner: true`; a temporary test `'member'` account →
`isAllowed: true, isOwner: false`; an unlisted email → both `false` —
checked against both the sync methods and the observable streams
(`userRole`/`isAllowed`/`isOwner`) that templates would actually bind to.
Also confirmed no regression: the existing "Access granted" badge and
Dashboard nav link still work correctly for a member account.

## Done: Firebase backend + live-editable allowlist admin UI — built 2026-08-07

The allowlist moved off the compile-time `ALLOWED_USERS` constant entirely
and now lives in **Firestore**, editable from a real in-app admin page at
`/dashboard/admin` (owner-only) — no more code-and-redeploy to change who
has access. This also unblocked what the roadmap always said it would:
the per-project visibility toggle below can now use the same Firestore
project instead of needing its own setup.

**Firebase project:** a new, separate project (`personal-website-8655e`,
Stockholm/`europe-north2`, Standard edition Firestore), deliberately not
sharing Chat-App's `chat-app-c1cbc` — matches the earlier leaning in this
doc. Firebase Auth's Google provider has the site's existing OAuth Client
ID (`520118713358-...`, from the separate "E-Conomic" Google Cloud
project) added under "whitelist client IDs from external projects" — this
is what lets the site reuse its *existing* Google login to also establish
a Firebase Auth session, instead of a second, separate sign-in popup.

**Key files:**
- `src/app/constants/firebase-config.ts` — the Firebase Web SDK config
- `src/app/services/firebase-app.ts` — shared `initializeApp()` singleton (Firebase throws if called twice)
- `src/app/services/allowed-users.service.ts` — the real source of truth now
- `src/app/pages/dashboard/admin/` — the admin UI
- `src/app/guards/owner.guard.ts` — new, guards `/dashboard/admin`
- `firestore.rules` — kept in the repo as the source of truth for what's published in the console (no Firebase CLI/automated deploy set up, so this doesn't auto-deploy — has to be manually pasted into the console's Rules tab when changed)

**The chicken-and-egg bootstrap problem, and how it's solved:** Firestore
starts empty, but the admin UI is gated behind `isOwner` — which comes
from Firestore data. So how does the very first owner record ever get
created? Solved with a hardcoded `BOOTSTRAP_OWNER_EMAIL` constant in
`allowed-users.service.ts` (`Niclasschaeffer96@gmail.com`) that exists
**outside** Firestore on purpose — it's the root of trust. On every
login, `ensureOwnerBootstrapped()` checks: if the allowlist is still
empty AND this is that exact email, self-write the first owner record.
After that first entry exists, this is permanently a no-op. The same
email is *also* hardcoded directly in the Firestore security rule (not
derived from Firestore data — same reasoning, avoids a rule that needs
data that needs the rule). **Consequence worth knowing:** if this one
email's own entry is ever deleted while other entries remain, they lose
admin access permanently through the UI (bootstrap only fires on a fully
*empty* list) — the admin UI's "Remove" button is deliberately disabled
for this specific email to prevent that; removing them would need
manually deleting the doc via Firebase Console instead.

**Security model:** reads are public (`allow read: if true`) — this data
was already effectively public before (compiled into the JS bundle), so
no regression. Writes require a Firebase Auth session whose token email
matches the hardcoded owner email exactly — enforced by Firestore itself,
not by the app's UI. `AllowedUsersService.ensureFirebaseAuth()` lazily
signs into Firebase Auth (via `signInWithCredential` using the site's
already-obtained Google access token) only when a write is actually
attempted, so regular visitors/members never pay that cost.

**A real bug found and fixed while testing:** the Firestore listener
(`onSnapshot`) failed with `permission-denied` on every fresh page load —
even though the exact same call succeeded when triggered manually after
the page had fully loaded, and even though `getDocs` (one-time read)
always worked fine from the start. Root cause: subscribing synchronously
in the service constructor raced Firestore's own internal client
startup — a request fired that early can bounce off a fully public rule,
and unlike transient network errors, Firestore doesn't auto-retry a
failed listener. Fixed by deferring the subscription one tick
(`setTimeout(..., 0)`), same pattern already used in `GoogleAuthService`
for an analogous startup race. Took real back-and-forth to isolate
(initially looked exactly like ordinary rules-propagation delay, which
it wasn't — confirmed by a temporary debug method proving `getDocs`
succeeded while `onSnapshot` from the constructor still failed, at the
same moment, against the same rules).

**What's actually been verified vs. what still needs a real test:**
- [x] Firestore read connectivity, rules, and the constructor timing fix — confirmed via the live service instance in-browser
- [x] Guard behavior — owner reaches `/dashboard/admin`, non-owner gets redirected to `/`
- [x] The bootstrap already happened for real — Niclas logged in for real at some point while testing E-conomic earlier, and the owner record was correctly self-created (`niclasschaeffer96@gmail.com` / `owner`), confirming the Firebase Auth bridge and write path both work end-to-end
- [ ] **Not yet tested: actually adding/removing/changing a role for someone via the admin UI.** This needs a real, currently-valid Google access token to bridge Firebase Auth for the write — couldn't be simulated in this session the same way reads could. Try adding a test email (even a throwaway one) via `/dashboard/admin` next time you're logged in for real, and confirm it shows up immediately and that `isAllowed` actually works for that account.

### Related idea: per-project toggle isn't just live/hidden — needs a third "coming soon" state

Owner should be able to control each project's public visibility from the
dashboard UI, not by editing code. Refined 2026-08-06: this isn't a binary
live/hidden switch — three states, per project:

1. **Live** — fully visible and usable by visitors (or allowed users, for
   gated apps like E-conomic).
2. **Coming soon** — project is still in testing, but a teaser still shows
   publicly on the Portfolio page (or wherever projects are listed) with a
   "Coming soon" tag/badge. Not clickable/usable yet, but visitors know it
   exists. This is the new bit — previously the idea only had "hidden."
3. **Hidden** — fully invisible to everyone except the owner, e.g. for
   something too early/rough to even tease yet.

Owner can still see and access all three states themselves (for testing);
the state only changes what *other visitors* see.

**Decided 2026-08-06:** two controls per project, not one 3-way toggle:

1. A primary **Live / Off** switch.
2. A secondary **"Coming soon"** checkbox that only applies/shows when the
   project is Off — checked = show the public teaser card with a "Coming
   soon" badge (exact label TBD, "Coming soon" is the working name);
   unchecked = fully Hidden, nothing shown to visitors.

So functionally still the same three outcomes (Live / Coming soon /
Hidden), just reached via a toggle + a dependent checkbox rather than one
flat 3-option picker — matches how the E-conomic dashboard card already
looks (a disabled card with a "Coming soon" badge), so the same visual
pattern can likely be reused for other projects in this state.

**Decided 2026-08-06: backend will be Firebase.** Niclas already runs
Firebase on the Chat-App side project, so there's a working setup to
follow rather than starting cold — likely Firestore for the project
states (live/off/coming-soon per project) and, per the earlier open
question, this also unblocks turning `ALLOWED_EMAILS` into a live
in-dashboard editable list instead of a code-and-redeploy config file,
since the same backend serves both needs.

**Checked Chat-App's actual setup now that it's cloned (`Chat-App/src/firebase.js`):**
React (Create React App) app using Firebase Auth + Firestore + Storage, on
its own dedicated Firebase project (`chat-app-c1cbc`) — config is plain
`initializeApp(firebaseConfig)` / `getAuth()` / `getFirestore()` /
`getStorage()`, with the config object hardcoded directly in source
(normal for Firebase's client SDK — the apiKey etc. aren't secret the way
a server key is; real protection comes from Firestore/Storage security
rules, same "public config, rules do the real gating" shape as this
site's own `ALLOWED_EMAILS`/Google-ACL approach).

**Settled 2026-08-07:** went with the separate, dedicated project as
leaned towards here — `personal-website-8655e`, not `chat-app-c1cbc`.
Firestore is live and already backing the allowlist (see the "Done:
Firebase backend" section above). The project-toggle feature described
above can now be built on this same Firestore instance — the backend
setup this section was waiting on is done, this specific feature just
hasn't been built yet.

## Planned: embed minor showcase projects via iframe — idea captured 2026-08-06, not built yet

Different use case from E-conomic, and a different embedding approach on
purpose: small side/demo projects (games, tools, one-offs — the kind
already listed on the Portfolio page, e.g. Chat-App, NoteEase,
SimonGame — **not KanBan, see below, it isn't a web app**) get deployed
independently to their own subdomain on the hosting platform. Instead of
visitors clicking through and leaving niclasjuul.dk entirely, show the
live running project inside a frame on the site itself (e.g. embedded in
its Portfolio card, or opened in a modal/panel), so browsing stays on the
main site.

Native merge (like E-conomic) doesn't make sense here — these projects
don't need to share the site's login/session, they're just meant to be
demoed. A plain `<iframe src="https://<project>.niclasjuul.dk">` pointed
at the already-deployed subdomain is the right tool: far less work than
porting each project's code into this app, and keeps each project
independently deployable.

**Real technical risk to check before committing to this, per project:**
an iframe embed only works if the subdomain's host doesn't block being
framed. If the hosting platform (or a future change to it) sends
`X-Frame-Options: DENY`/`SAMEORIGIN` or a CSP `frame-ancestors` header
that excludes niclasjuul.dk, the browser will refuse to render the iframe
— just a blank box, and that's controlled by the *framed* project's own
server response headers, not something fixable from the parent site's
side. Needs a per-project check once each is actually deployed, not
something to assume works uniformly.

**What each cloned project actually is** (checked 2026-08-06, now that
they're cloned locally):

- `NoteEase` — Create React App, no backend/Firebase found, looks like
  client-only state. Needs a build step to deploy.
- `PasswordGenerator` — plain HTML/CSS/JS, no framework, no build step.
  Simplest possible thing to host on a subdomain.
- `SimonGame` — same, plain HTML/CSS/JS, no build step.
- `Chat-App` — React (CRA) + Firebase (see backend section above). This
  one's a bit more involved to deploy/iframe than the other two, and
  actually *does* have its own login (Firebase Auth) — worth deciding
  later whether that's confusing alongside the site's own Google login,
  or just accepted as "each embedded project handles its own auth if it
  has any."
- `KanBan` — **cloned 2026-08-06, and it breaks the iframe plan.** Not a
  web app at all: a JavaFX desktop application (`pom.xml`, `javafx-controls`,
  `javafx-fxml`) with an explicit client-server split (`serverMain` +
  `clientMain`, IPs configured manually in a `Config` class), meant to be
  run locally through IntelliJ IDEA — looks like a DTU coursework project
  (`groupId: dk.dtu`). There is no browser-runnable version to point an
  iframe at.

  **Consequence:** the iframe-embed plan (subdomain + `<iframe>`) doesn't
  apply to KanBan as-is. Turns out this is already handled — its
  `cv-profile.ts` entry already has `livepreviewurl: ''` (empty) and a
  description explicitly saying the live preview won't work, clone from
  GitHub instead. So it's already just a GitHub-link portfolio entry,
  no live demo, matching what makes sense given it can't run in a
  browser. Niclas is open to scrapping the entry entirely later on;
  nothing to build here either way.

## Open questions to revisit later

- ~~Do we ever want more than a hardcoded allowlist?~~ — resolved
  2026-08-07, see "Done: Firebase backend" section above. There's a real
  admin UI now; the only remaining hardcoded piece is the one bootstrap
  owner email, by design.
- Roles: confirm the two-role model (owner/member) is enough, or whether
  more granularity will be needed later (e.g. per-project permissions
  instead of a single member role).
- Project toggle: the backend question is resolved (Firestore, same
  project as the allowlist) — just needs the actual feature built now.
  Also needs to cover "live" state for iframe-embedded minor projects,
  not just E-conomic.
- Per minor project once deployed: confirm its host doesn't send
  `X-Frame-Options`/CSP headers that would block embedding it here.
- ~~Project toggle states~~ — resolved, see "coming soon" state note above
  (Live/Off switch + dependent Coming-soon checkbox).
- **New from this session:** admin UI's actual add/remove/change-role
  flow hasn't been tested with a real write yet — see the checklist in
  the "Done: Firebase backend" section above.
