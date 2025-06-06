
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { ResumeData, PersonalInfo, WorkExperienceEntry, EducationEntry, CertificationEntry, ProjectEntry, AwardEntry, LanguageEntry, AdditionalOptions } from '@/lib/types';
import { initialResumeData } from '@/lib/types';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Heart } from 'lucide-react'; // App Icon, Heart for footer
import { ThemeToggleButton } from '@/components/theme-toggle-button';

// Form Section Components
import { PersonalInfoSection } from '@/components/resume-form/personal-info-section';
import { CareerObjectiveSection } from '@/components/resume-form/career-objective-section';
import { SkillsSection } from '@/components/resume-form/skills-section';
import { WorkExperienceSection } from '@/components/resume-form/work-experience-section';
import { EducationSection } from '@/components/resume-form/education-section';
import { CertificationsSection } from '@/components/resume-form/certifications-section';
import { ProjectsSection } from '@/components/resume-form/projects-section';
import { AwardsSection } from '@/components/resume-form/awards-section';
import { LanguagesSection } from '@/components/resume-form/languages-section';
import { KeywordsSection } from '@/components/resume-form/keywords-section';
import { AdditionalOptionsSection } from '@/components/resume-form/additional-options-section';

// Preview Component
import { ResumePreview } from '@/components/resume-preview/resume-preview';

// Sanitizer functions for data loaded from localStorage
const sanitizeWorkExperienceEntry = (item: any): WorkExperienceEntry => ({
  id: (item?.id && typeof item.id === 'string') ? item.id : crypto.randomUUID(),
  jobTitle: typeof item?.jobTitle === 'string' ? item.jobTitle : '',
  companyName: typeof item?.companyName === 'string' ? item.companyName : '',
  location: typeof item?.location === 'string' ? item.location : '',
  startDate: typeof item?.startDate === 'string' ? item.startDate : '',
  endDate: typeof item?.endDate === 'string' ? item.endDate : '',
  responsibilities: (Array.isArray(item?.responsibilities)
    ? item.responsibilities.filter((r: any): r is string => typeof r === 'string')
    : ['']
  ).map(r => r || ''),
});

const sanitizeEducationEntry = (item: any): EducationEntry => ({
  id: (item?.id && typeof item.id === 'string') ? item.id : crypto.randomUUID(),
  degreeTitle: typeof item?.degreeTitle === 'string' ? item.degreeTitle : '',
  universityName: typeof item?.universityName === 'string' ? item.universityName : '',
  graduationYear: typeof item?.graduationYear === 'string' ? item.graduationYear : '',
  gpa: typeof item?.gpa === 'string' ? item.gpa : '',
});

const sanitizeCertificationEntry = (item: any): CertificationEntry => ({
  id: (item?.id && typeof item.id === 'string') ? item.id : crypto.randomUUID(),
  name: typeof item?.name === 'string' ? item.name : '',
  issuedBy: typeof item?.issuedBy === 'string' ? item.issuedBy : '',
  completionDate: typeof item?.completionDate === 'string' ? item.completionDate : '',
});

const sanitizeProjectEntry = (item: any): ProjectEntry => ({
  id: (item?.id && typeof item.id === 'string') ? item.id : crypto.randomUUID(),
  title: typeof item?.title === 'string' ? item.title : '',
  technologies: typeof item?.technologies === 'string' ? item.technologies : '',
  description: typeof item?.description === 'string' ? item.description : '',
  link: typeof item?.link === 'string' ? item.link : '',
});

const sanitizeAwardEntry = (item: any): AwardEntry => ({
  id: (item?.id && typeof item.id === 'string') ? item.id : crypto.randomUUID(),
  name: typeof item?.name === 'string' ? item.name : '',
  date: typeof item?.date === 'string' ? item.date : '',
  description: typeof item?.description === 'string' ? item.description : '',
});

const sanitizeLanguageEntry = (item: any): LanguageEntry => ({
  id: (item?.id && typeof item.id === 'string') ? item.id : crypto.randomUUID(),
  language: typeof item?.language === 'string' ? item.language : '',
  proficiency: typeof item?.proficiency === 'string' ? item.proficiency : '',
});


export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isClient, setIsClient] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
    setCurrentYear(new Date().getFullYear());
    const savedData = localStorage.getItem('resumeFlowData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        const validatedData: ResumeData = {
          ...initialResumeData,
          ...parsedData,
          personalInfo: { 
            ...initialResumeData.personalInfo, 
            ...(parsedData.personalInfo && typeof parsedData.personalInfo === 'object' ? parsedData.personalInfo : {}) 
          },
          workExperience: (Array.isArray(parsedData.workExperience) ? parsedData.workExperience : [])
            .filter((item: any): item is Partial<WorkExperienceEntry> => item && typeof item === 'object')
            .map(sanitizeWorkExperienceEntry),
          education: (Array.isArray(parsedData.education) ? parsedData.education : [])
            .filter((item: any): item is Partial<EducationEntry> => item && typeof item === 'object')
            .map(sanitizeEducationEntry),
          certifications: (Array.isArray(parsedData.certifications) ? parsedData.certifications : [])
            .filter((item: any): item is Partial<CertificationEntry> => item && typeof item === 'object')
            .map(sanitizeCertificationEntry),
          projects: (Array.isArray(parsedData.projects) ? parsedData.projects : [])
            .filter((item: any): item is Partial<ProjectEntry> => item && typeof item === 'object')
            .map(sanitizeProjectEntry),
          awards: (Array.isArray(parsedData.awards) ? parsedData.awards : [])
            .filter((item: any): item is Partial<AwardEntry> => item && typeof item === 'object')
            .map(sanitizeAwardEntry),
          languages: (Array.isArray(parsedData.languages) ? parsedData.languages : [])
            .filter((item: any): item is Partial<LanguageEntry> => item && typeof item === 'object')
            .map(sanitizeLanguageEntry),
          skills: typeof parsedData.skills === 'string' ? parsedData.skills : initialResumeData.skills,
          careerObjective: typeof parsedData.careerObjective === 'string' ? parsedData.careerObjective : initialResumeData.careerObjective,
          keywords: typeof parsedData.keywords === 'string' ? parsedData.keywords : initialResumeData.keywords,
          additionalOptions: { 
            ...initialResumeData.additionalOptions, 
            ...(parsedData.additionalOptions && typeof parsedData.additionalOptions === 'object' ? parsedData.additionalOptions : {}) 
          },
        };
        setResumeData(validatedData);
      } catch (error) {
        console.error("Failed to parse saved resume data:", error);
        localStorage.removeItem('resumeFlowData'); 
      }
    }
  }, []); 

  useEffect(() => {
    if(isClient) {
      localStorage.setItem('resumeFlowData', JSON.stringify(resumeData));
    }
  }, [resumeData, isClient]);

  const handlePersonalInfoChange = useCallback((field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  }, []);

  const handleSimpleChange = useCallback(<K extends keyof ResumeData>(section: K, value: ResumeData[K]) => {
    setResumeData(prev => ({ ...prev, [section]: value }));
  }, []);
  
  const handleAdditionalOptionsChange = useCallback((field: keyof AdditionalOptions, value: any) => {
    setResumeData(prev => ({
      ...prev,
      additionalOptions: { ...prev.additionalOptions, [field]: value },
    }));
  }, []);


  if (!isClient) {
    return <div className="flex items-center justify-center min-h-screen">Loading ResumeFlow...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-card border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-primary">ResumeFlow</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggleButton />
            <Button variant="outline" onClick={() => {
              if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
                setResumeData(initialResumeData);
                localStorage.removeItem('resumeFlowData');
              }
            }}>
              Reset Data
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <ScrollArea className="lg:col-span-2 h-[calc(100vh-8rem)] rounded-md">
            <div className="space-y-6 pr-4">
              <PersonalInfoSection data={resumeData.personalInfo} onChange={handlePersonalInfoChange} />
              <CareerObjectiveSection value={resumeData.careerObjective} onChange={(val) => handleSimpleChange('careerObjective', val)} />
              <SkillsSection value={resumeData.skills} onChange={(val) => handleSimpleChange('skills', val)} />
              <WorkExperienceSection data={resumeData.workExperience} onChange={(val) => handleSimpleChange('workExperience', val as WorkExperienceEntry[])} />
              <EducationSection data={resumeData.education} onChange={(val) => handleSimpleChange('education', val as EducationEntry[])} />
              <CertificationsSection data={resumeData.certifications} onChange={(val) => handleSimpleChange('certifications', val as CertificationEntry[])} />
              <ProjectsSection data={resumeData.projects} onChange={(val) => handleSimpleChange('projects', val as ProjectEntry[])} />
              <AwardsSection data={resumeData.awards} onChange={(val) => handleSimpleChange('awards', val as AwardEntry[])} />
              <LanguagesSection data={resumeData.languages} onChange={(val) => handleSimpleChange('languages', val as LanguageEntry[])} />
              <KeywordsSection resumeData={resumeData} onChange={(val) => handleSimpleChange('keywords', val)} />
              <AdditionalOptionsSection 
                options={resumeData.additionalOptions} 
                resumeData={resumeData}
                onChange={handleAdditionalOptionsChange}
              />
            </div>
          </ScrollArea>
          
          <div className="lg:col-span-1">
            <ResumePreview data={resumeData} template={resumeData.additionalOptions.template} />
          </div>
        </div>
      </main>

      <footer className="bg-card border-t py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>&copy; {currentYear || new Date().getFullYear()} ResumeFlow. All rights reserved.</p>
          <p className="flex items-center justify-center mt-1">
            Made with  <Heart className="h-4 w-4 mx-1 text-red-500 fill-current" /> Ankit Modanwal  </p>
        </div>
      </footer>
    </div>
  );
}

