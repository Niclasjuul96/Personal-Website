# React + TypeScript Setup & Best Practices Guide

## Project Overview

A professional React portfolio website built with **TypeScript**, **Vite**, and **SCSS**, following modern best practices for type safety, component composition, and scalability.

---

## Phase 1: Project Setup with TypeScript

### 1.1 Initialize Vite Project with TypeScript

```bash
npm create vite@latest portfolio -- --template react-ts
cd portfolio
npm install
```

### 1.2 Install Core Dependencies

```bash
# Core framework
npm install react@18.2.0 react-dom@18.2.0

# Routing
npm install react-router-dom@6.0.2

# Email service
npm install @emailjs/browser@3.11.0 emailjs@4.0.2

# Maps (optional)
npm install @react-google-maps/api@2.19.2

# Icons
npm install font-awesome@4.7.0

# Styling
npm install sass@1.65.1
```

### 1.3 Install Type Definitions

```bash
# Install @types packages for dependencies without built-in types
npm install -D @types/react@18.2.0
npm install -D @types/react-dom@18.2.0
npm install -D @types/node
```

### 1.4 Configure TypeScript (tsconfig.json)

Vite provides a sensible default, but optimize it:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@assets/*": ["src/assets/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 1.5 Verify Setup

```bash
npm run dev
# Should start dev server on :3000 with TypeScript checking
```

---

## Phase 2: TypeScript Project Structure & Configuration

### 2.1 Create Directory Structure

```
src/
├── types/                    # Shared type definitions
│   ├── index.ts             # Export all types
│   ├── components.ts        # Component prop types
│   ├── data.ts              # Data model types
│   └── common.ts            # Common utility types
├── utils/                    # Utility functions
│   ├── emailService.ts      # EmailJS integration
│   └── helpers.ts           # Helper functions
├── hooks/                    # Custom React hooks
│   └── useNavigation.ts     # Navigation hook example
├── assets/
│   ├── data/
│   │   ├── Education.ts
│   │   ├── OtherWorkExperience.ts
│   │   ├── WorkExperience.ts
│   │   ├── projects.ts
│   │   ├── services.ts
│   │   └── techstack.ts
│   ├── langLogo/
│   ├── project-images/
│   └── webfontkit-20230828-052518/
├── components/
│   ├── About/
│   │   ├── About.tsx
│   │   └── About.scss
│   ├── Contact/
│   │   ├── Contact.tsx
│   │   └── Contact.scss
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.scss
│   ├── Home/
│   │   ├── Home.tsx
│   │   └── Home.scss
│   ├── Portfolio/
│   │   ├── Portfolio.tsx
│   │   └── Portfolio.scss
│   └── common/              # Reusable components
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Modal.tsx
├── App.tsx
├── App.scss
└── index.tsx
```

### 2.2 Create Core Type Definitions

**src/types/common.ts:**

```typescript
// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export type HTMLElementEvent<T extends HTMLElement> = Event & {
  currentTarget: T;
};
```

**src/types/data.ts:**

```typescript
// Data model types
export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
  details?: string;
  gpa?: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string | null; // null for current role
  technologies: string[];
  highlights?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  links: {
    github?: string;
    live?: string;
    demo?: string;
  };
  featured: boolean;
}

export interface TechStack {
  category: string;
  technologies: Technology[];
}

export interface Technology {
  name: string;
  logo: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}
```

**src/types/components.ts:**

```typescript
// Component prop types
import { ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
```

**src/types/index.ts:**

```typescript
// Export all types from a single entry point
export * from "./common";
export * from "./data";
export * from "./components";
```

---

## Phase 3: Component Development with TypeScript

### 3.1 Typed Functional Component Pattern

**src/components/common/Button.tsx:**

```typescript
import React from 'react';
import { ButtonProps } from '@types/components';
import './Button.scss';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  onClick,
}) => {
  const buttonClass = `btn btn-${variant} btn-${size} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </button>
  );
};

Button.displayName = 'Button';
```

### 3.2 Page Component with Props

**src/components/Portfolio/Portfolio.tsx:**

```typescript
import React, { useMemo, useState } from 'react';
import { Project } from '@types/data';
import projects from '@assets/data/projects';
import './Portfolio.scss';

interface FilterState {
  technology: string | null;
  searchTerm: string;
}

const Portfolio: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    technology: null,
    searchTerm: '',
  });

  const filteredProjects = useMemo<Project[]>(() => {
    return projects.filter((project) => {
      const matchesTech =
        !filters.technology ||
        project.technologies.includes(filters.technology);
      const matchesSearch = project.title
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());
      return matchesTech && matchesSearch;
    });
  }, [filters]);

  return (
    <section className="portfolio">
      <h1>My Work</h1>
      <div className="portfolio-grid">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="project-card">
      <img src={project.image} alt={project.title} />
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="technologies">
        {project.technologies.map((tech) => (
          <span key={tech} className="tech-tag">
            {tech}
          </span>
        ))}
      </div>
      <div className="links">
        {project.links.github && (
          <a href={project.links.github}>GitHub</a>
        )}
        {project.links.live && (
          <a href={project.links.live}>Live Demo</a>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
```

### 3.3 Form Component with Validation

**src/components/Contact/Contact.tsx:**

```typescript
import React, { useState } from 'react';
import { ContactFormData } from '@types/components';
import { sendEmail } from '@utils/emailService';
import './Contact.scss';

interface FormErrors {
  [key in keyof ContactFormData]?: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await sendEmail(formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Email send failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact">
      <h1>Get In Touch</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <span id="name-error" className="error">
              {errors.name}
            </span>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {submitStatus === 'success' && (
        <div className="success-message">Message sent successfully!</div>
      )}
      {submitStatus === 'error' && (
        <div className="error-message">Failed to send message. Please try again.</div>
      )}
    </section>
  );
};

export default Contact;
```

---

## Phase 4: Data Files with TypeScript

### 4.1 Typed Data Files

**src/assets/data/projects.ts:**

```typescript
import { Project } from "@types/data";

const projects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with React and Node.js",
    image: "/project-images/ecommerce.png",
    technologies: ["React", "TypeScript", "Node.js", "MongoDB"],
    links: {
      github: "https://github.com/...",
      live: "https://...",
    },
    featured: true,
  },
  // More projects...
];

export default projects;
```

**src/assets/data/techstack.ts:**

```typescript
import { TechStack } from "@types/data";

const techStack: TechStack[] = [
  {
    category: "Frontend",
    technologies: [
      {
        name: "React",
        logo: "/langLogo/react.svg",
        proficiency: "advanced",
      },
      {
        name: "TypeScript",
        logo: "/langLogo/typescript.svg",
        proficiency: "advanced",
      },
      {
        name: "SCSS",
        logo: "/langLogo/scss.svg",
        proficiency: "intermediate",
      },
    ],
  },
  // More categories...
];

export default techStack;
```

---

## Phase 5: Utility Functions with TypeScript

### 5.1 Typed Utility Functions

**src/utils/emailService.ts:**

```typescript
import emailjs from "@emailjs/browser";
import { ContactFormData, ApiResponse } from "@types/index";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

export const sendEmail = async (
  formData: ContactFormData,
): Promise<ApiResponse<{ messageId: string }>> => {
  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
    });

    return {
      success: true,
      data: { messageId: response.status.toString() },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      data: { messageId: "" },
      error: errorMessage,
    };
  }
};
```

**src/utils/helpers.ts:**

```typescript
// Helper function with type safety
export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const truncate = (text: string, length: number): string => {
  return text.length > length ? `${text.slice(0, length)}...` : text;
};

// Generic array utility
export const groupBy = <T, K extends keyof T>(
  array: T[],
  key: K,
): Record<string, T[]> => {
  return array.reduce(
    (acc, item) => {
      const groupKey = String(item[key]);
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
};
```

---

## Phase 6: Custom React Hooks

### 6.1 Typed Custom Hooks

**src/hooks/useNavigation.ts:**

```typescript
import { useLocation } from "react-router-dom";

export interface NavItem {
  label: string;
  path: string;
}

export const useNavigation = (): {
  currentPath: string;
  isActive: (path: string) => boolean;
} => {
  const location = useLocation();

  return {
    currentPath: location.pathname,
    isActive: (path: string) => location.pathname === path,
  };
};
```

**src/hooks/useAsync.ts:**

```typescript
import { useEffect, useState } from "react";

interface UseAsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

type AsyncFunction<T> = () => Promise<T>;

export const useAsync = <T>(
  asyncFunction: AsyncFunction<T>,
  immediate = true,
): UseAsyncState<T> => {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
  });

  const execute = async () => {
    setState({ data: null, error: null, isLoading: true });
    try {
      const response = await asyncFunction();
      setState({ data: response, error: null, isLoading: false });
    } catch (error) {
      setState({
        data: null,
        error: error instanceof Error ? error : new Error("Unknown error"),
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    if (!immediate) return;
    execute();
  }, []);

  return state;
};
```

---

## Phase 7: App Structure & Routing

**src/App.tsx:**

```typescript
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '@components/Header/Header';
import Home from '@components/Home/Home';
import About from '@components/About/About';
import Portfolio from '@components/Portfolio/Portfolio';
import Contact from '@components/Contact/Contact';
import './App.scss';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
```

**src/index.tsx:**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## Phase 8: Build & Environment Configuration

### 8.1 Create .env File

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### 8.2 Update vite.config.ts

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
    },
  },
});
```

### 8.3 Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx"
  }
}
```

---

## Phase 9: Package Installation & Build

### 9.1 Install All Dependencies

```bash
npm install
npm run type-check  # Verify TypeScript is working
```

### 9.2 Development Workflow

```bash
npm run dev         # Start dev server
npm run type-check  # Check for type errors
npm run build       # Create production build
```

---

## Best Practices Summary

### ✅ DO:

- Always define prop types and return types explicitly
- Use `React.FC<Props>` for functional components
- Keep types in dedicated files (`src/types/`)
- Use path aliases (`@types`, `@utils`) for cleaner imports
- Leverage `Pick`, `Omit`, `Record`, and other utility types
- Create generic types for reusable patterns
- Use discriminated unions for complex state
- Export types from `src/types/index.ts` for single entry point

### ❌ DON'T:

- Use `any` — if needed, use `unknown` instead
- Create inline types in many places — centralize them
- Mix JS and TS files unnecessarily
- Forget to add `React` import in older TSX files (automatic in modern versions)
- Leave `tsconfig.json` as strict: false — embrace strict mode
- Ignore TypeScript errors to "move faster" — types catch bugs early

---

## Common TypeScript Patterns

### Optional Props

```typescript
interface Props {
  title: string;
  subtitle?: string; // Optional
  count?: number;
}
```

### Union Types

```typescript
type Status = "idle" | "loading" | "success" | "error";
type Button = { type: "primary" } | { type: "secondary" };
```

### Generic Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export const List = <T,>({ items, renderItem }: ListProps<T>) => (
  <ul>
    {items.map((item, i) => (
      <li key={i}>{renderItem(item)}</li>
    ))}
  </ul>
);
```

### Event Handlers

```typescript
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.currentTarget.value);
};

const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
};
```

---

## Troubleshooting

| Issue                         | Solution                                                |
| ----------------------------- | ------------------------------------------------------- |
| Types not found               | Check tsconfig.json paths, ensure file extensions       |
| "any" type errors             | Enable strict mode, add explicit types                  |
| Module resolution fails       | Verify path aliases in vite.config.ts and tsconfig.json |
| Build succeeds but types fail | Run `npm run type-check` to find issues                 |
| IDE not recognizing types     | Restart VS Code, check tsconfig.json is valid           |

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Vite TypeScript Setup](https://vitejs.dev/guide/features.html#typescript)
- [EmailJS Documentation](https://www.emailjs.com/docs/)
