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
- `ALLOWED_EMAILS` allowlist (`src/app/constants/google-config.ts`) gates
  access to owner-only pages. Anyone can log in; only listed emails see
  gated content. Add/remove emails there and redeploy to change access —
  no UI for this yet (decided against a live settings page for now since
  it'd require standing up a backend).
- `/dashboard` route exists, guarded by `allowedGuard`
  (`src/app/guards/allowed.guard.ts`), redirects non-allowed users home.
  Currently just a welcome message + a disabled "E-conomic — Coming soon"
  card.
- Key files:
  - `src/app/constants/google-config.ts` — Client ID, scopes, ALLOWED_EMAILS
  - `src/app/services/google-auth.service.ts` — auth state, login/logout
  - `src/app/guards/allowed.guard.ts` — route protection
  - `src/app/pages/dashboard/` — the gated dashboard page
  - `src/app/header/` — login button / user badge / Dashboard nav link

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

- [x] ~~Decide how E-conomic actually gets merged in~~ — **decided
      2026-08-06: native merge**, not iframe. Pull E-conomic's Angular
      components into this app as a lazy-loaded route (e.g.
      `/dashboard/economic`). Reasoning: native merge reuses the Google
      login already built here; an iframe would mean a second, separate
      login inside the frame (auth doesn't share across iframe origins),
      which defeats the point of building shared login in the first place.
- [ ] When merged: extend `GOOGLE_CONFIG.SCOPES` to include the
      Sheets/Drive scopes E-conomic already uses (see
      `E-conomic/frontend/src/app/constants/google-config.ts`), and re-ask
      for consent since scopes changed.
- [ ] Replace the "Coming soon" dashboard card with the real E-conomic entry
      point once merged.
- [ ] Longer-term/maybe: a real backend if any future feature needs
      server-side authorization instead of relying on Google's own ACLs.
- [x] ~~Clone the other side projects down into the local coding folder~~
      — **done 2026-08-06.** Cloned: `Chat-App`, `NoteEase`,
      `PasswordGenerator`, `SimonGame`. **`KanBan` was not cloned** —
      still only referenced via its GitHub link in `cv-profile.ts`, not
      present locally. Clone it too whenever it's needed.

## Planned: roles (owner vs. allowed) — idea captured 2026-08-06, not built yet

Flat `ALLOWED_EMAILS` isn't enough once there's a feature only the owner
should touch. Two roles needed:

- **Owner** (Niclas only) — sees everything a regular allowed user sees,
  PLUS an admin capability: toggle which projects show as "live" on the
  public site vs. hidden (e.g. still in testing).
- **Allowed / member** (anyone on the list who isn't the owner) — sees
  gated apps like E-conomic, but NOT the project live/hidden toggle or any
  other owner-only admin controls.

Likely shape (not decided/built): evolve `ALLOWED_EMAILS: string[]` into
something like `ALLOWED_USERS: { email: string; role: 'owner' | 'member' }[]`,
with `isOwnerRole` (role === 'owner') and `isAllowed` (any role present)
derived from it — same pattern as the current `isEmailAllowed` helper in
`google-auth.service.ts`, just role-aware.

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

Leaning towards: **a separate, dedicated Firebase project for
Personal-Website**, not reusing `chat-app-c1cbc` — that project is
purpose-built and named for the chat app specifically, and mixing in
unrelated dashboard/allowlist/project-toggle data would just be
confusing to manage later. Not fully decided, but the Chat-App setup
gives a concrete template to copy (`firebase.js` shape, `firebase`
npm package, Firestore for data) rather than designing from scratch.

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

- Do we ever want more than a hardcoded allowlist (e.g. a real "invite a
  user" flow)? Explicitly decided against a live admin UI for now — would
  need a backend.
- Roles: confirm the two-role model (owner/member) is enough, or whether
  more granularity will be needed later (e.g. per-project permissions
  instead of a single member role).
- Project toggle: config-file redeploy vs. real backend — see above.
  Deciding this also settles the live-email-allowlist question from
  earlier, since both need the same infrastructure. Also now needs to
  cover "live" state for iframe-embedded minor projects, not just
  E-conomic.
- Per minor project once deployed: confirm its host doesn't send
  `X-Frame-Options`/CSP headers that would block embedding it here.
- ~~Project toggle states~~ — resolved, see "coming soon" state note above
  (Live/Off switch + dependent Coming-soon checkbox).
