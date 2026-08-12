# Niclas Schæffer - Personal Portfolio Website

A modern, responsive personal site built with **Angular 22** featuring a cyberpunk-inspired dark theme. Beyond a standard portfolio, it's the single entry point for Niclas's own tools: log in with Google once and it unlocks a personal dashboard — a live-editable Portfolio, and a full budget tracker (E-conomic) merged in natively.

## 🌟 Features

- **Responsive Design**: Mobile-first approach with adaptive layouts across all devices
- **Cyberpunk Aesthetic**: Dark theme with neon cyan, magenta, and lime accent colors
- **Google Sign-In**: One login unlocks the personal dashboard; a Firestore-backed allowlist and role system (`owner` / `member`) controls access, editable live from the admin UI — no code-and-redeploy needed
- **Dashboard-managed Portfolio**: Projects (content, tech stack, links, images) plus per-project visibility (Live / Coming soon / Hidden) and drag-and-drop ordering, all editable from `/dashboard/admin` and reflected live on the Portfolio page
- **Inline project demos**: Individual projects can be embedded directly in their Portfolio modal via `<iframe>`, so visitors can try them without leaving the site
- **E-conomic (budget tracker)**: A full budget-tracking app merged natively into the dashboard, restyled to match the site's theme, gated behind login + Google Sheets/Drive access
- **CV page**: Multi-role (Software Engineer / IT Support / General) and bilingual (EN/DA) CV, with preset combinations and a print-to-PDF export
- **Email Integration**: Contact form powered by EmailJS for direct communication
- **Smooth Animations**: Polished transitions and hover effects throughout

## 📄 Pages

### Home
- Hero introduction section
- Services overview (Web Development, UI/UX Design, Freelancing)
- Work experience timeline
- Education history

### About
- Personal avatar and bio
- Tech stack display
- Social media links
- Contact information

### Portfolio
- Project grid, fully managed from `/dashboard/admin` (content, visibility, order) — not hardcoded
- Interactive modal with project details, demo account credentials, GitHub/live-preview links
- Selected projects render an inline, interactive `<iframe>` demo instead of just linking out

### CV
- Role and language presets (EN/DA × Software Engineer/IT Support/General)
- Print-to-PDF export with a suggested filename per preset

### Contact
- Information cards (phone, email, location)
- Contact form with validation, real-time error messages, and success confirmation

### Dashboard (behind Google login + allowlist)
- **Economic**: budget tracker — CSV/Sheets import, transaction breakdown, budget table
- **Admin** (owner only): manage the allowlist/roles, Portfolio project content, visibility, and ordering

## 🛠️ Tech Stack

- **Framework**: Angular 22 (standalone components, native `@if`/`@for` control flow)
- **Language**: TypeScript
- **Styling**: SCSS (Dart Sass with `@use` syntax)
- **Routing**: Angular Router with route guards (`allowedGuard`, `ownerGuard`) and lazy-loaded dashboard routes
- **Auth & Data**: Firebase (Firestore, Storage) + Google Identity Services for OAuth login
- **Email Service**: EmailJS (`@emailjs/browser`)
- **Icons**: Font Awesome 6.4.2 (CDN)
- **Design System**: Custom cyberpunk design with reusable SCSS mixins

### Development Tools
- **Node.js**: v24.19.0 (Angular 22 requires ≥24.15.0, ≥22.22.3, or ≥26.0.0)
- **Angular CLI**: @22.1.3
- **Build Tool**: esbuild-based application builder (Angular CLI default), webpack-based dev server

## 📦 Installation & Setup

### Prerequisites
- Node.js ≥24.15.0 (or ≥22.22.3 / ≥26.0.0)
- npm

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Personal-Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase & Google login — no setup needed**
   `src/app/constants/firebase-config.ts` and `google-config.ts` are committed as-is; these are public, client-exposed values by design (Firebase web config and an OAuth client ID aren't secrets — real security comes from Firestore/Storage security rules and Google's own per-file Sheets/Drive permissions, not from hiding these). Cloning the repo is enough to run the app locally against the same Firebase project.

4. **Configure EmailJS** (only thing that needs local setup — required for the Contact form)
   - Copy the example environment file:
     ```bash
     cp src/environments/environment.example.ts src/environments/environment.ts
     cp src/environments/environment.example.ts src/environments/environment.prod.ts
     ```
   - Fill in your EmailJS credentials:
     ```typescript
     export const environment = {
       production: false,
       emailjs: {
         serviceId: 'your_service_id',
         templateId: 'your_template_id',
         publicKey: 'your_public_key',
       },
     };
     ```
   - **How to get EmailJS credentials:** sign up at [EmailJS](https://www.emailjs.com/), create a service and template, copy the Service ID, Template ID, and Public Key.

   ⚠️ **Security Note**: `environment.ts` / `environment.prod.ts` are gitignored and should never be committed.

## 🚀 Development

### Start Development Server
```bash
ng serve
```
Navigate to `http://localhost:4200/`. The application automatically reloads on code changes.

### Generate New Component
```bash
ng generate component component-name
```

## 🔨 Building

### Development Build
```bash
ng build --configuration development
```

### Production Build
```bash
ng build
```

Build artifacts are stored in the `dist/personal-website` directory, optimized for performance.

## 🧪 Testing

Karma/Jasmine are configured (Angular CLI defaults, `ng test`), but no test suites have been written yet.

## 📁 Project Structure

```
src/
├── app/
│   ├── pages/
│   │   ├── home/                 # Home page
│   │   ├── about/                # About page
│   │   ├── portfolio/            # Portfolio page + project modal (incl. iframe embeds)
│   │   ├── cv/                   # Multi-role/multi-language CV + PDF export
│   │   ├── contact/               # Contact form page
│   │   └── dashboard/
│   │       ├── dashboard.component.ts  # Dashboard landing (allowlist-gated)
│   │       ├── economic/          # Budget tracker (owner/member only)
│   │       └── admin/             # Allowlist, roles, Portfolio content management (owner only)
│   ├── header/                    # Navigation header, incl. Google sign-in
│   ├── guards/                    # allowedGuard, ownerGuard route guards
│   ├── services/                  # Firebase app/auth bridge, Google auth, Firestore-backed
│   │                              # services (projects, project visibility, allowlist), EmailJS
│   ├── constants/                 # firebase-config.ts, google-config.ts (public, committed)
│   ├── data/                      # Static content: cv-profile, experience/education, tech stack
│   ├── assets/                    # Images and static files
│   ├── app.routes.ts              # Route configuration
│   ├── app.component.ts           # Root component
│   └── app.component.html         # Root template
├── styles/
│   ├── cyberpunk-design.scss      # Design system & variables
│   └── styles.scss                # Global stylesheet
└── index.html                     # Entry point
```

## 🎨 Design System

Custom SCSS design system (`cyberpunk-design.scss`) includes:

- **Color Variables**: Neon cyan, magenta, lime, dark backgrounds
- **Typography Scales**: Responsive font sizes
- **Spacing Scales**: Consistent padding/margin system
- **Mixins**: Reusable styles for buttons, borders, glows, flexbox
- **Animations**: Fade-in, glow, and hover effects

## 🔒 Security Model

- **Google login + allowlist is a UX gate, not the real security boundary** — the compiled JS bundle is public either way.
- **E-conomic's real security** comes from Google's own per-file Sheets/Drive permissions: API calls use the logged-in user's own OAuth token, which can only read files Google has granted that account access to.
- **Firestore-backed data** (allowlist, Portfolio projects, visibility, order) is protected by **Firestore/Storage security rules**, checking a bridged Firebase Auth session against the owner's email — not by the app's UI. Changes to `firestore.rules`/`storage.rules` are **not auto-deployed** and must be manually published via the Firebase console.
- Firebase web config and the Google OAuth client ID are intentionally committed (`src/app/constants/`) — they're public, client-facing values by design.

## 📧 Email Integration

The contact form uses **EmailJS** for sending emails without backend infrastructure — form validation, real-time error messages, success confirmation, and a message length limit (10–250 characters). Configure via `src/environments/environment.ts` (see Setup above).

## 🌐 Deployment

Build for production:
```bash
ng build
```

Deploy the `dist/personal-website` directory to your hosting provider. Remember: any change to `firestore.rules`/`storage.rules` needs a separate, manual publish step in the Firebase console — it isn't part of this build/deploy.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
