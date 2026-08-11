# Todo / Roadmap

Original note: Merge Economics ind i hjemmeside, da jeg vil tilføje login
funktionalitet således jeg kan tilgå budget igennem min hjemmeside.

## Vision

Turn the personal website into the single entry point for Niclas's own
tools. Log in with Google once on the site, and it unlocks personal
apps/pages that visitors don't see — starting with E-conomic (budget
tracker), more later.

## Current state (as of 2026-08-11)

- **Google login** in the header, via Google Identity Services' OAuth2
  token client. Site login only requests basic identity scopes
  (`BASIC_SCOPES`); Sheets/Drive access (`SHEETS_SCOPES`) is a separate,
  second consent step requested only inside E-conomic, since browsers
  block auto-triggered OAuth popups.
- **Firestore-backed allowlist and roles** (`owner` | `member`), editable
  live from `/dashboard/admin` — no more code-and-redeploy to change who
  has access. One hardcoded bootstrap owner email exists outside Firestore
  on purpose (root of trust for the chicken-and-egg problem of an
  owner-only admin UI needing an owner record to exist first).
- **E-conomic (budget tracker)** merged in natively at
  `/dashboard/economic`, restyled to match the site's cyberpunk theme,
  gated behind login + Sheets/Drive access.
- **Portfolio page** is now fully dashboard-managed instead of hardcoded:
  - Projects (title, description, tech stack, links, image) — add/edit/
    delete from `/dashboard/admin`, images uploaded to Firebase Storage.
  - Per-project visibility (Live / Coming soon / Hidden) and drag-and-drop
    ordering — also from the admin page, live on the Portfolio page.
- Everything above shares one Firebase project (`personal-website-8655e`)
  and the same pattern: public reads, owner-only writes enforced by
  Firestore/Storage security rules (not just the app's UI).

**Key files:**
- `src/app/services/google-auth.service.ts` — login/logout, roles
- `src/app/services/allowed-users.service.ts` — Firestore-backed allowlist
- `src/app/services/projects.service.ts` — Portfolio project content + image upload
- `src/app/services/project-visibility.service.ts` — Live/Coming soon/Hidden + ordering
- `src/app/services/project-id-slug.ts`, `firebase-auth-bridge.ts` — small shared helpers
- `src/app/pages/dashboard/admin/` — the admin UI (allowlist + Projects management)
- `src/app/pages/dashboard/economic/` — the merged E-conomic feature
- `firestore.rules`, `storage.rules` — **not auto-deployed**; any change here needs
  manually pasting into the Firebase console (Firestore Database → Rules,
  Storage → Rules) before it takes effect

## Important architecture decision: what "allowed" actually protects

The allowlist/role check is a **client-side UX gate**, not a real security
boundary — the compiled JS bundle is public either way. Real security for
E-conomic comes from **Google's own per-file Sheets/Drive permissions**:
API calls use the logged-in user's own OAuth token, which can only read
files Google has granted that account access to. For the Firestore-backed
data (allowlist, projects, visibility, order), real security comes from
**Firestore/Storage security rules** checking a bridged Firebase Auth
session against the hardcoded owner email — not from the app's UI.
Revisit this if a future feature needs data that isn't already protected
one of these two ways.

## Planned: embed minor showcase projects via iframe — idea captured 2026-08-06, not built yet

Small side/demo projects (Chat-App, NoteEase, SimonGame, PasswordGenerator
— not KanBan, see below) already run on their own subdomains
(`chatapp.niclasjuul.dk` etc., confirmed live in Hostinger's File
Manager). Idea: embed them via `<iframe>` in their Portfolio card instead
of just linking out, so browsing stays on the main site. Native merge
(like E-conomic) doesn't make sense here — no shared login needed.

**Real risk to check per project before committing:** an iframe only
works if the subdomain's host doesn't send `X-Frame-Options`/CSP
`frame-ancestors` headers blocking it — that's controlled by the framed
project's own server response, not fixable from the parent site.

**KanBan** isn't a web app (JavaFX desktop app, DTU coursework) — already
handled correctly as a GitHub-link-only Portfolio entry with no live
preview, not part of the iframe plan.

## Open questions to revisit later

- Roles: confirm the two-role model (owner/member) is enough, or whether
  more granularity will be needed later (e.g. per-project permissions).
- Whether/how the Live/Coming-soon/Hidden toggle should cover minor
  iframe-embedded projects once those exist, not just the current 5
  Portfolio entries.
- Per minor project once iframe-embedded: confirm its host doesn't block
  framing (see above).
- Admin allowlist's add/remove/change-role write path hasn't been
  explicitly tested with a real write — low priority, since Projects CRUD
  (same owner-write security pattern) has already been proven working
  end-to-end.
- Optional cleanup, not urgent: old project image files from before the
  Storage migration are still sitting unused in Hostinger's File Manager
  (`public_html/assets/project-images/`) — harmless, can delete whenever.
