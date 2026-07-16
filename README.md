# Niclas Schæffer - Personal Portfolio Website

A modern, responsive portfolio website built with **Angular 19** featuring a cyberpunk-inspired dark theme design. The site showcases work experience, projects, tech stack, and provides direct contact capabilities.

## 🌟 Features

- **Responsive Design**: Mobile-first approach with adaptive layouts across all devices
- **Cyberpunk Aesthetic**: Dark theme with neon cyan, magenta, and lime accent colors
- **Smooth Animations**: Polished transitions and hover effects throughout
- **Email Integration**: Contact form powered by EmailJS for direct communication
- **Project Showcase**: Interactive portfolio grid with modal details and demo account information
- **Social Links**: Direct links to LinkedIn, GitHub, and Facebook
- **Multi-page Navigation**: Seamless routing between Home, About, Portfolio, and Contact pages

## 📄 Pages

### Home
- Hero introduction section
- Services overview (Web Development, UI/UX Design, Freelancing)
- Work experience timeline
- Education history
- Other professional experience

### About
- Personal avatar and bio
- Tech stack display (10+ technologies)
- CV download link
- Social media links
- Contact information

### Portfolio
- Project grid showcase (5 projects)
- Interactive modal with project details
- Demo account credentials display
- GitHub and live preview links
- Technology stack for each project

### Contact
- Information cards (phone, email, location)
- Contact form with validation
- Real-time error messages
- Success confirmation
- Social media links

## 🛠️ Tech Stack

- **Framework**: Angular 19 (Standalone Components)
- **Language**: TypeScript
- **Styling**: SCSS (Dart Sass with @use syntax)
- **Routing**: Angular Router with lazy loading support
- **Forms**: Angular FormsModule with two-way binding
- **Email Service**: EmailJS (@emailjs/browser)
- **Icons**: Font Awesome 6.4.2 (CDN)
- **Design System**: Custom cyberpunk design with reusable SCSS mixins

### Development Tools
- **Node.js**: v24.14.0
- **Angular CLI**: @19.2.27
- **Build Tool**: Webpack (Angular CLI default)

## 📦 Installation & Setup

### Prerequisites
- Node.js v24.14.0 or higher
- npm or yarn package manager

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

3. **Configure Environment Variables** (Required for email functionality)
   - Copy the example environment file:
     ```bash
     cp src/environments/environment.example.ts src/environments/environment.ts
     cp src/environments/environment.example.ts src/environments/environment.prod.ts
     ```
   - Update `src/environments/environment.ts` with your EmailJS credentials:
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
   - Update `src/environments/environment.prod.ts` with production credentials
   
   **How to get EmailJS credentials:**
   1. Sign up at [EmailJS](https://www.emailjs.com/)
   2. Create a new service and template
   3. Copy your Service ID, Template ID, and Public Key
   
   ⚠️ **Security Note**: Environment files are ignored by Git and should never be committed to version control.

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

### Code Scaffolding
```bash
ng generate --help
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

Build artifacts are stored in the `dist/` directory. Production builds are optimized for performance and speed.

## 🧪 Testing

### Unit Tests
```bash
ng test
```

### End-to-End Tests
```bash
ng e2e
```

## 📁 Project Structure

```
src/
├── app/
│   ├── pages/
│   │   ├── home/          # Home page component
│   │   ├── about/         # About page component
│   │   ├── portfolio/     # Portfolio page with modal
│   │   └── contact/       # Contact form page
│   ├── header/            # Navigation header component
│   ├── services/          # EmailJS service & form validation
│   ├── data/              # Static data files
│   │   ├── services.ts    # Services data
│   │   ├── data.ts        # Experience & education data
│   │   ├── projects.ts    # Portfolio projects
│   │   └── techstack.ts   # Tech stack display
│   ├── assets/            # Images and static files
│   │   ├── project-images/
│   │   └── langLogo/
│   ├── app.routes.ts      # Route configuration
│   ├── app.component.ts   # Root component
│   └── app.component.html # Root template
├── styles/
│   ├── cyberpunk-design.scss  # Design system & variables
│   └── styles.scss            # Global stylesheet
└── index.html             # Entry point

```

## 🎨 Design System

Custom SCSS design system (`cyberpunk-design.scss`) includes:

- **Color Variables**: Neon cyan, magenta, lime, dark backgrounds
- **Typography Scales**: Responsive font sizes
- **Spacing Scales**: Consistent padding/margin system
- **Mixins**: Reusable styles for buttons, borders, glows, flexbox
- **Animations**: Glitch effect, fade-in, scanline effects

## 📧 Email Integration

The contact form uses **EmailJS** for sending emails without backend infrastructure:

- Form validation for name, email, and message
- Real-time error messages
- Success confirmation display
- Message length limit (10-250 characters)

Configure in `src/app/services/email.service.ts`.

## 📱 Responsive Breakpoints

- **Desktop**: Full 2-column layout
- **Tablet** (max-width: 1024px): Single column stacking
- **Mobile** (max-width: 768px): Optimized mobile view

## 🔒 Performance & Security

### Security Best Practices
- **Environment Variables**: Sensitive credentials (EmailJS keys) are stored in environment files that are ignored by Git
- **XSS Protection**: Angular sanitization prevents XSS attacks
- **No Client-Side Secrets**: API keys are environment-specific and never hardcoded
- **Production Builds**: Optimized with tree-shaking and minification
- **Git Configuration**: `.gitignore` excludes all environment files to prevent accidental commits

### Performance
- Production builds with optimization
- Asset compression
- Lazy-loaded routes
- Code splitting for better caching

### Why Environment Files?
The project uses Angular's environment configuration system to keep credentials secure:
- **Development**: `src/environments/environment.ts`
- **Production**: `src/environments/environment.prod.ts`
- Both files are in `.gitignore` and not committed to version control
- Users clone the repo and create their own environment files with their credentials
- The build system automatically uses the correct file based on configuration

## 📝 Key Files

| File | Purpose |
|------|---------|
| `src/app/app.routes.ts` | Central routing configuration |
| `src/app/services/email.service.ts` | EmailJS integration & validation |
| `src/styles/cyberpunk-design.scss` | Design system & theme |
| `src/app/data/projects.ts` | Portfolio project data |
| `src/app/data/techstack.ts` | Technology stack display |

## 🌐 Deployment

Build for production:
```bash
ng build --prod
```

Deploy the `dist/personal-website` directory to your hosting provider.

## 📄 Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
