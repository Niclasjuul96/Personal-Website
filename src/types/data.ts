// Data model types
export interface Service {
  id: number;
  name: string;
  img: string;
  description: string;
  link: string;
}

export interface Experience {
  id: number;
  title: string;
  duration: string;
  description: string;
}

export interface Education {
  id: number;
  school: string;
  degree: string;
  duration: string;
  details?: string;
}

export interface Project {
  id: number;
  title: string;
  imgURL: string;
  detail: string;
  githuburl: string;
  livepreviewurl: string;
  tech: string[];
  accounts?: string[];
}

export interface Technology {
  name: string;
  icon: string;
}

export interface TechStackCategory {
  category: string;
  technologies: Technology[];
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export type FormErrors = Partial<Record<keyof ContactFormData, string>>;
