import { cvProfile, type DateRange } from './cv-profile';

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

const renderDate = (date: DateRange): string => {
  return Array.isArray(date) ? date.join(' | ') : date;
};

export const workExperiences: Experience[] = cvProfile.workExperience.map((item, index) => ({
  id: index + 1,
  title: item.company,
  duration: renderDate(item.date),
  description: item.description.en
}));

export const otherExperiences: Experience[] = cvProfile.otherExperience.map((item, index) => ({
  id: index + 1,
  title: item.name,
  duration: renderDate(item.date),
  description: item.description.en
}));

export const education: Education[] = cvProfile.education.map((item, index) => ({
  id: index + 1,
  school: item.name.en,
  degree: item.name.en,
  duration: renderDate(item.date),
  details: item.legacyDetails || item.description.en
}));
