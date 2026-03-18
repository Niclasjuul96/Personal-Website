// Component prop types
import { ReactNode } from 'react';

export interface CardServiceProps {
  name: string;
  img: string;
  description: string;
}

export interface CardExperienceProps {
  title: string;
  duration: string;
  description: string;
}

export interface EducationCardProps {
  school: string;
  degree: string;
  duration: string;
  details?: string;
}

export interface ProjectCardProps {
  title: string;
  image: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  accounts?: string[];
}

export interface TechStackItemProps {
  name: string;
  icon: string;
}

export interface HeadingProps {
  title: string;
  showUnderline?: boolean;
}

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  disabled?: boolean;
}
