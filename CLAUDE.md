# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies
npm start             # ng serve — dev server on :4200 (this is the user's own session; see "Dev server" below)
npm run build          # ng build — production build, output to dist/personal-website
npm run watch          # ng build --watch --configuration development
npm test               # ng test (Karma/Jasmine) — no spec files exist yet, this currently has nothing to run
ng generate component pages/foo   # scaffold a new standalone component
```

There is no lint script/config in this repo.

### Dev server

The user typically already has `ng serve` running on port **4200** as their own working session. Don't attach the Browser pane to that instance or drive it — use the `personal-website-test` launch config (port 4300) from the top-level `.claude/launch.json` for any browser-based verification instead.

## Architecture

### What this is

A single Angular app that's both a public portfolio site *and*, behind one Google login, a personal dashboard for tools the owner built for themselves — started with a budget tracker (E-conomic), more may follow. Visitors see Home/About/Portfolio/CV/Contact; logging in unlocks `/dashboard`.

### Routing & guards (`app.routes.ts`, `src/app/guards/`)

- `/`, `/about`, `/portfolio`, `/cv`, `/contact` — public, eagerly loaded.
- `/dashboard` — gated by `allowedGuard` (must be on the Firestore allowlist).
- `/dashboard/economic`, `/dashboard/admin` — lazy-loaded (`loadComponent`). Economic uses `allowedGuard`; **admin uses `ownerGuard`** — there is no separate "admin" role, only `owner` and `member`, and only `owner` can reach `/dashboard/admin`.
- Both guards wait on `AllowedUsersService.loaded` before deciding (`filter(loaded) → take(1)`), because the allowlist now lives in Firestore and loads asynchronously — deciding before that first load risks a false "not allowed" on a hard refresh.

### Auth: two-step Google OAuth (`google-auth.service.ts`, `constants/google-config.ts`)

Site login (the header button) requests only `BASIC_SCOPES` (basic identity). Sheets/Drive access (`SHEETS_SCOPES`) is requested as a **second, separate consent step triggered only inside E-conomic** — not bundled into the initial login — because browsers block auto-triggered OAuth popups, so the extra-scope request has to originate from a real user click at the point it's actually needed.

### Data layer: Firestore + Storage

Firestore-backed services follow the same shape: a `BehaviorSubject` fed by `onSnapshot` (subscribed via `setTimeout(() => this.subscribe(), 0)` in the constructor — subscribing synchronously races Firestore's internal client startup), a `loaded` observable the guards wait on, and writes gated by `ensureFirebaseAuth(accessToken)` (`firebase-auth-bridge.ts`, which bridges the Google OAuth token into a Firebase Auth session).

- `allowed-users.service.ts` — the allowlist/roles (`owner` | `member`). One bootstrap owner email is hardcoded outside Firestore on purpose — it's the root of trust for the chicken-and-egg problem of an owner-only admin UI needing an owner record to exist before anyone can create one.
- `projects.service.ts` — Portfolio project content (title, description, tech stack, links, image, `embeddable` flag), plus Storage image upload. Doc ids are `"<reservedId>-<slug-of-title>"` (`project-id-slug.ts`) for console readability; legacy bare-numeric ids self-heal to this scheme on next edit.
- `project-visibility.service.ts` — per-project Live/Coming-soon/Hidden state and drag-and-drop ordering, keyed by the same project ids.

### Security model — read this before assuming the allowlist is real security

The allowlist/role check is a **client-side UX gate only** — the compiled JS bundle is public regardless of routing guards. Actual security is enforced two different ways depending on the data:

- **E-conomic** (Google Sheets/Drive data): protected by **Google's own per-file permissions** — API calls use the logged-in user's own OAuth token, which can only read files that account was actually granted access to. Nothing app-side to bypass here.
- **Firestore-backed data** (allowlist, Portfolio projects, visibility, order): protected by **`firestore.rules`/`storage.rules`**, which check a bridged Firebase Auth session against the hardcoded owner email — not by the app's UI or route guards.

**`firestore.rules` and `storage.rules` are not auto-deployed.** Any change to them requires manually pasting the new rules into the Firebase console (Firestore Database → Rules, Storage → Rules) before it takes effect — a normal `git push` / redeploy does nothing for these.

### Portfolio (`pages/portfolio/`)

Fully dashboard-managed, not hardcoded — content, visibility, and order all come from `projects.service.ts` / `project-visibility.service.ts`, edited at `/dashboard/admin`. A project can set `embeddable: true` to render its `livepreviewurl` inline as an `<iframe>` in the Portfolio modal (sanitized via `DomSanitizer.bypassSecurityTrustResourceUrl` — trusted only because the URL is owner-written, never visitor-supplied) instead of just linking out; the modal widens to `96vw`/`80vh` when doing so. This only works for projects whose host doesn't send `X-Frame-Options`/CSP `frame-ancestors`.

### CV (`pages/cv/`)

Role (developer/it-support/general) × language (en/da) presets, each with a generated filename and print-to-PDF export. **Gotcha already hit once:** anything feeding an `@for` loop that uses `track item` (identity-based) must be a stable field, not a method called directly from the template — a method that rebuilds objects via `.map()` on every change-detection pass desyncs the tracked identity between Angular's check and recheck passes and throws `NG0100`. See `experienceForCurrentRole`/`otherExperienceForCurrentRole`, computed once in `ngOnInit` and whenever `role` changes, for the pattern to follow.

### Build config notes (`angular.json`)

- Bundle-size budgets (`initial`, `anyComponentStyle`) were raised above Angular CLI's scaffold defaults to match this app's actual size — they were already exceeded independent of Angular version, not something to "fix" by shrinking bundles unless asked.
- Every component has `changeDetection: ChangeDetectionStrategy.Eager` explicitly set — an Angular 22 migration artifact that preserves pre-v22 default behavior, not a deliberate performance choice.
- Standalone components throughout, native `@if`/`@for` control flow (migrated off `*ngIf`/`*ngFor`).

## Codex config detected

Found `~/.codex/config.toml` on this machine. Reply `/import` to scan it and list what's importable (MCP servers, slash commands, subagents, skills, instructions) into Claude Code, or `/import --yes=<digest>` once you've seen the scan output to apply it.
