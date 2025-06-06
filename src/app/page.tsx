"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { ResumeData, PersonalInfo, WorkExperienceEntry, EducationEntry, CertificationEntry, ProjectEntry, AwardEntry, LanguageEntry, AdditionalOptions } from '@/lib/types';
import { initialResumeData } from '@/lib/types';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from 'lucide-react'; // App Icon

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

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load data from localStorage if available
    const savedData = localStorage.getItem('resumeFlowData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Ensure loaded data structure matches, especially for arrays
        const validatedData = {
          ...initialResumeData,
          ...parsedData,
          personalInfo: { ...initialResumeData.personalInfo, ...parsedData.personalInfo },
          workExperience: Array.isArray(parsedData.workExperience) ? parsedData.workExperience : [],
          education: Array.isArray(parsedData.education) ? parsedData.education : [],
          certifications: Array.isArray(parsedData.certifications) ? parsedData.certifications : [],
          projects: Array.isArray(parsedData.projects) ? parsedData.projects : [],
          awards: Array.isArray(parsedData.awards) ? parsedData.awards : [],
          languages: Array.isArray(parsedData.languages) ? parsedData.languages : [],
          additionalOptions: { ...initialResumeData.additionalOptions, ...parsedData.additionalOptions },
        };
        setResumeData(validatedData);
      } catch (error) {
        console.error("Failed to parse saved resume data:", error);
        localStorage.removeItem('resumeFlowData'); // Clear corrupted data
      }
    }
  }, []);

  useEffect(() => {
    if(isClient) {
      // Save data to localStorage on change
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
    // Basic loading state or return null to prevent SSR issues with localStorage/useState
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
          <Button variant="outline" onClick={() => {
            if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
              setResumeData(initialResumeData);
              localStorage.removeItem('resumeFlowData');
            }
          }}>
            Reset Data
          </Button>
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
              <AdditionalOptionsSection data={resumeData.additionalOptions} onChange={handleAdditionalOptionsChange} />
            </div>
          </ScrollArea>
          
          <div className="lg:col-span-1">
            <ResumePreview data={resumeData} template={resumeData.additionalOptions.template} />
          </div>
        </div>
      </main>
    </div>
  );
}
