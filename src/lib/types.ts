export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  linkedin?: string;
  portfolio?: string;
  location: string;
}

export interface WorkExperienceEntry {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  startDate: string; // MM/YYYY
  endDate: string;   // MM/YYYY or "Present"
  responsibilities: string[];
}

export interface EducationEntry {
  id: string;
  degreeTitle: string;
  universityName: string;
  graduationYear: string;
  gpa?: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuedBy: string;
  completionDate: string; // MM/YYYY
}

export interface ProjectEntry {
  id: string;
  title: string;
  technologies: string; // comma-separated
  description: string;
  link?: string;
}

export interface AwardEntry {
  id: string;
  name: string;
  date?: string; // MM/YYYY
  description?: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: string; // e.g., Native, Fluent, Conversational
}

export type ResumeTemplate = 'Minimal' | 'Modern' | 'Classic';
export type ExportFormat = 'PDF' | 'DOCX';

export interface AdditionalOptions {
  template: ResumeTemplate;
  exportFormat: ExportFormat;
  addCoverLetter: boolean;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  careerObjective: string;
  skills: string; // comma-separated string
  workExperience: WorkExperienceEntry[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  projects: ProjectEntry[];
  awards: AwardEntry[];
  languages: LanguageEntry[];
  keywords: string; // comma-separated string
  additionalOptions: AdditionalOptions;
}

export const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    location: '',
  },
  careerObjective: '',
  skills: '',
  workExperience: [],
  education: [],
  certifications: [],
  projects: [],
  awards: [],
  languages: [],
  keywords: '',
  additionalOptions: {
    template: 'Modern',
    exportFormat: 'PDF',
    addCoverLetter: false,
  },
};
