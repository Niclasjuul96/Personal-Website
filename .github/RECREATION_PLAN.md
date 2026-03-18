# Portfolio Project Recreation Plan

## Project Overview

A modern, responsive portfolio website built with **React 18**, **Vite**, and **SCSS**, featuring multiple pages with routing, a contact form with email integration, and project showcases.

---

## Phase 1: Project Setup

### 1.1 Initialize Project

- [ ] Create new Vite project: `npm create vite@latest portfolio -- --template react`
- [ ] Navigate to project: `cd portfolio`
- [ ] Install dependencies: `npm install`

### 1.2 Install Core Dependencies

- [ ] React & React-DOM: `npm install react@18.2.0 react-dom@18.2.0` (already included with Vite template)
- [ ] **Routing**: `npm install react-router-dom@6.0.2`
- [ ] **Email Service**: `npm install @emailjs/browser@3.11.0 emailjs@4.0.2`
- [ ] **Maps**: `npm install @react-google-maps/api@2.19.2`
- [ ] **Icons**: `npm install font-awesome@4.7.0`
- [ ] **Styling**: `npm install sass@1.65.1`

### 1.3 Install Dev Dependencies

- [ ] `npm install -D @vitejs/plugin-react@4.3.4 vite@6.1.0`

### 1.4 Configure Vite

- [ ] Update `vite.config.js`:

  ```javascript
  import { defineConfig } from "vite";
  import react from "@vitejs/plugin-react";

  export default defineConfig({
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
    },
  });
  ```

### 1.5 Verify Setup

- [ ] Run `npm start` to confirm development server starts on port 3000

---

## Phase 2: Project Structure & Styling

### 2.1 Create Directory Structure

```
src/
├── assets/
│   ├── Education.js
│   ├── OtherWorkExperience.js
│   ├── WorkExperience.js
│   ├── projects.js
│   ├── services.js
│   ├── techstack.js
│   ├── langLogo/
│   ├── project-images/
│   └── webfontkit-20230828-052518/ (custom fonts)
├── components/
│   ├── About.jsx
│   ├── About.scss
│   ├── Contact.jsx
│   ├── Contact.scss
│   ├── Header.jsx
│   ├── Header.scss
│   ├── Home.jsx
│   ├── Home.scss
│   ├── Portfolio.jsx
│   └── Portfolio.scss
├── App.jsx
├── App.scss
└── index.jsx
```

### 2.2 Set Up Global Styles

- [ ] Create `App.scss` with:
  - Global CSS reset/normalize
  - Color variables and themes
  - Layout utilities
  - Responsive breakpoints
- [ ] Import Font Awesome: Add to `App.scss`:
  ```scss
  @import "~font-awesome/css/font-awesome.css";
  ```
- [ ] Configure custom font imports from `webfontkit` directory

---

## Phase 3: Core Components

### 3.1 Create App.jsx (Main Router)

- [ ] Set up React Router with routes:
  - `/` → Home
  - `/about` → About
  - `/portfolio` → Portfolio
  - `/contact` → Contact
- [ ] Structure with Header (persistent) + Routes (page-specific)
- [ ] Apply styling from `App.scss`

### 3.2 Create Header Component

- [ ] **Header.jsx**:
  - Navigation links to all pages
  - Logo/branding (if applicable)
  - Mobile hamburger menu (responsive)
  - Active route highlighting
- [ ] **Header.scss**:
  - Flexbox layout
  - Mobile-first responsive design
  - Hover/active states

### 3.3 Create Home Component

- [ ] **Home.jsx**:
  - Hero section with introduction
  - Call-to-action buttons
  - Featured projects preview
  - Skills summary
- [ ] **Home.scss**:
  - Hero image/background
  - Typography hierarchy
  - Section spacing and layouts

### 3.4 Create About Component

- [ ] **About.jsx**:
  - Personal bio section
  - Education (from `assets/Education.js`)
  - Work experience (from `assets/WorkExperience.js`)
  - Other experience (from `assets/OtherWorkExperience.js`)
  - Tech stack/skills (from `assets/techstack.js`)
  - Use tech stack logos from `assets/langLogo/`
- [ ] **About.scss**:
  - Timeline styles for education/experience
  - Card layouts for skills
  - Grid for tech stack logos

### 3.5 Create Portfolio Component

- [ ] **Portfolio.jsx**:
  - Project gallery from `assets/projects.js`
  - Project cards with:
    - Project image (from `assets/project-images/`)
    - Title, description
    - Technologies used
    - Links (GitHub, live demo, etc.)
  - Filter or sort projects (optional enhancement)
- [ ] **Portfolio.scss**:
  - Grid layout (responsive: 1 col mobile, 2-3 cols desktop)
  - Card styling with hover effects
  - Image optimization

### 3.6 Create Contact Component

- [ ] **Contact.jsx**:
  - Contact form with fields:
    - Name, Email, Subject, Message
    - Form validation
    - Success/error feedback
  - Integrate EmailJS service
  - Optional: Google Maps API for location
  - Social media links
- [ ] **Contact.scss**:
  - Form styling
  - Button states
  - Accessibility (focus states, labels)
- [ ] Environment config:
  - Store EmailJS Service ID and Template ID in `.env`
  - Configure EmailJS initialization in component

---

## Phase 4: Data & Assets Management

### 4.1 Create Data Files

- [ ] **assets/Education.js**: Export array of education entries
  ```javascript
  export const education = [
    { school, degree, field, startYear, endYear, details },
    // ...
  ];
  ```
- [ ] **assets/WorkExperience.js**: Export array of work experiences
- [ ] **assets/OtherWorkExperience.js**: Export additional experiences
- [ ] **assets/projects.js**: Export array of projects with:
  - Title, description, image, tech stack, links
- [ ] **assets/services.js**: Export services/skills offered
- [ ] **assets/techstack.js**: Export tech stack categories

### 4.2 Organize Assets

- [ ] Populate `assets/langLogo/` with technology logos
- [ ] Populate `assets/project-images/` with project screenshots
- [ ] Keep custom fonts in `webfontkit/` directory (reference in CSS)

---

## Phase 5: Integrations & Features

### 5.1 EmailJS Setup

- [ ] Create EmailJS account (emailjs.com)
- [ ] Set up email template
- [ ] Get Service ID, Template ID, and Public Key
- [ ] Create `.env` file:
  ```
  VITE_EMAILJS_SERVICE_ID=your_service_id
  VITE_EMAILJS_TEMPLATE_ID=your_template_id
  VITE_EMAILJS_PUBLIC_KEY=your_public_key
  ```
- [ ] Import and initialize in `Contact.jsx`:

  ```javascript
  import emailjs from "@emailjs/browser";

  emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  ```

- [ ] Create form submission handler

### 5.2 Google Maps (Optional)

- [ ] Set up Google Maps API key (if not already done)
- [ ] Add to `.env`:
  ```
  VITE_GOOGLE_MAPS_API_KEY=your_api_key
  ```
- [ ] Implement map component in Contact section if needed

### 5.3 Responsive Design

- [ ] Test all breakpoints (mobile: 320px, tablet: 768px, desktop: 1024px+)
- [ ] Ensure Header responsive menu works
- [ ] Test portfolio grid responsiveness
- [ ] Verify form usability on mobile

---

## Phase 6: Build & Deployment

### 6.1 Update Package.json Scripts

- [ ] Ensure scripts are set:
  ```json
  "start": "vite",
  "build": "vite build"
  ```

### 6.2 Production Build

- [ ] Run `npm run build` to create dist folder
- [ ] Verify bundle size and optimize if needed

### 6.3 Deployment Options

- [ ] **Vercel**: Connect GitHub repo → auto-deploy
- [ ] **Netlify**: Similar process
- [ ] **GitHub Pages**: Configure for static hosting
- [ ] Other: AWS, Heroku, custom server

### 6.4 Environment Variables

- [ ] Set `.env` variables in hosting platform
- [ ] Test live contact form
- [ ] Verify all links work

---

## Phase 7: Optimization & Polish

### 7.1 Performance

- [ ] Optimize images (use WebP, compress)
- [ ] Code splitting for route-based chunks
- [ ] Lazy load components if needed
- [ ] Check Lighthouse scores

### 7.2 Accessibility

- [ ] Semantic HTML (nav, section, article, etc.)
- [ ] ARIA labels where needed
- [ ] Color contrast ratios
- [ ] Keyboard navigation

### 7.3 SEO

- [ ] Meta tags in index.html
- [ ] Open Graph tags for social sharing
- [ ] Structured data (JSON-LD)

### 7.4 Browser Testing

- [ ] Chrome, Firefox, Safari, Edge
- [ ] Mobile devices (iOS, Android)
- [ ] Test contact form submission

---

## Key Commands Reference

```bash
# Development
npm start                    # Start dev server on :3000

# Building
npm run build               # Create production build

# Dependencies
npm install                 # Install all dependencies
npm list                    # View installed versions
```

---

## File Checklist

- [ ] `.env` (environment variables)
- [ ] `vite.config.js` (build config)
- [ ] `package.json` (dependencies & scripts)
- [ ] `index.html` (entry point)
- [ ] `src/index.jsx` (React entry)
- [ ] `src/App.jsx` (main component)
- [ ] `src/App.scss` (global styles)
- [ ] `src/components/*` (5 components + styles)
- [ ] `src/assets/*` (data files & images)
- [ ] `.gitignore` (exclude node_modules, .env, dist/)

---

## Troubleshooting Tips

| Issue               | Solution                                                    |
| ------------------- | ----------------------------------------------------------- |
| Styling not applied | Ensure SCSS is imported, check file paths                   |
| EmailJS not sending | Verify service ID, template ID, API key in .env             |
| Routes not working  | Check React Router setup, verify path names match links     |
| Images not loading  | Verify image paths relative to src/, consider using imports |
| Build failing       | Check for console errors, verify all dependencies installed |

---

## Notes

- This project was migrated from Create React App to Vite (note: README.md still references CRA)
- Update README.md to reflect Vite setup
- Consider adding .gitignore if not present
- Test on multiple devices before final deployment
