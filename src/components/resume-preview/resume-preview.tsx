"use client";

import type React from 'react';
import type { ResumeData, ResumeTemplate } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye } from 'lucide-react';

// Basic Template Components (can be moved to separate files later)
const MinimalTemplate = ({ data }: { data: ResumeData }) => (
  <div className="p-6 bg-white text-sm font-sans text-gray-800 shadow-lg rounded-md border border-gray-200">
    <h1 className="text-3xl font-bold text-center mb-2 font-headline">{data.personalInfo.fullName || "Your Name"}</h1>
    <p className="text-center text-xs text-gray-600 mb-4">
      {data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.location}
      {data.personalInfo.linkedin && ` | ${data.personalInfo.linkedin}`}
      {data.personalInfo.portfolio && ` | ${data.personalInfo.portfolio}`}
    </p>

    {data.careerObjective && (
      <section className="mb-4">
        <h2 className="text-lg font-semibold border-b-2 border-gray-300 pb-1 mb-2 font-headline">Summary</h2>
        <p className="text-xs">{data.careerObjective}</p>
      </section>
    )}

    {data.skills && (
      <section className="mb-4">
        <h2 className="text-lg font-semibold border-b-2 border-gray-300 pb-1 mb-2 font-headline">Skills</h2>
        <p className="text-xs">{data.skills}</p>
      </section>
    )}
    
    {data.workExperience.length > 0 && (
      <section className="mb-4">
        <h2 className="text-lg font-semibold border-b-2 border-gray-300 pb-1 mb-2 font-headline">Experience</h2>
        {data.workExperience.map(exp => (
          <div key={exp.id} className="mb-3 text-xs">
            <h3 className="font-bold">{exp.jobTitle}</h3>
            <p className="italic">{exp.companyName} - {exp.location}</p>
            <p className="text-gray-500">{exp.startDate} - {exp.endDate}</p>
            <ul className="list-disc list-inside ml-4">
              {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        ))}
      </section>
    )}

    {data.education.length > 0 && (
       <section className="mb-4">
        <h2 className="text-lg font-semibold border-b-2 border-gray-300 pb-1 mb-2 font-headline">Education</h2>
        {data.education.map(edu => (
          <div key={edu.id} className="mb-3 text-xs">
            <h3 className="font-bold">{edu.degreeTitle}</h3>
            <p className="italic">{edu.universityName}</p>
            <p className="text-gray-500">Graduated: {edu.graduationYear}{edu.gpa && ` - GPA: ${edu.gpa}`}</p>
          </div>
        ))}
      </section>
    )}

    {/* Add other sections (Certifications, Projects, etc.) similarly */}
    <p className="text-center text-xs mt-6 text-gray-400">Minimal Template</p>
  </div>
);

const ModernTemplate = ({ data }: { data: ResumeData }) => (
  <div className="p-8 bg-white text-gray-700 shadow-xl rounded-lg border border-gray-200 font-serif">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-4xl font-bold text-primary mb-1 font-headline">{data.personalInfo.fullName || "Your Name"}</h1>
        <p className="text-md text-gray-500">{/* Placeholder for current role / title if added */}</p>
      </div>
      <div className="text-right text-xs">
        <p>{data.personalInfo.email}</p>
        <p>{data.personalInfo.phone}</p>
        <p>{data.personalInfo.location}</p>
        {data.personalInfo.linkedin && <p>{data.personalInfo.linkedin}</p>}
        {data.personalInfo.portfolio && <p>{data.personalInfo.portfolio}</p>}
      </div>
    </div>

    {data.careerObjective && (
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-primary border-l-4 border-primary pl-2 mb-2 font-headline">PROFILE</h2>
        <p className="text-sm">{data.careerObjective}</p>
      </section>
    )}
    
    {data.skills && (
       <section className="mb-6">
        <h2 className="text-xl font-semibold text-primary border-l-4 border-primary pl-2 mb-2 font-headline">SKILLS</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.split(',').map(skill => skill.trim()).filter(s => s).map((skill, i) => (
            <span key={i} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">{skill}</span>
          ))}
        </div>
      </section>
    )}

    {data.workExperience.length > 0 && (
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-primary border-l-4 border-primary pl-2 mb-3 font-headline">WORK EXPERIENCE</h2>
        {data.workExperience.map(exp => (
          <div key={exp.id} className="mb-4 text-sm">
            <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
            <p className="font-medium text-gray-600">{exp.companyName} | {exp.location}</p>
            <p className="text-xs text-gray-500 mb-1">{exp.startDate} - {exp.endDate}</p>
            <ul className="list-disc list-inside ml-5 text-xs space-y-0.5">
              {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        ))}
      </section>
    )}
    
    {data.education.length > 0 && (
       <section className="mb-6">
        <h2 className="text-xl font-semibold text-primary border-l-4 border-primary pl-2 mb-3 font-headline">EDUCATION</h2>
        {data.education.map(edu => (
          <div key={edu.id} className="mb-3 text-sm">
            <h3 className="text-lg font-semibold">{edu.degreeTitle}</h3>
            <p className="font-medium text-gray-600">{edu.universityName}</p>
            <p className="text-xs text-gray-500">Graduated: {edu.graduationYear}{edu.gpa && ` - GPA: ${edu.gpa}`}</p>
          </div>
        ))}
      </section>
    )}

    <p className="text-center text-xs mt-8 text-gray-400">Modern Template</p>
  </div>
);

const ClassicTemplate = ({ data }: { data: ResumeData }) => (
  <div className="p-6 bg-white text-sm font-serif text-gray-900 shadow-md rounded border border-gray-300">
    <h1 className="text-2xl font-bold text-center border-b-2 border-gray-800 pb-2 mb-4 font-headline">{data.personalInfo.fullName || "Your Name"}</h1>
    <p className="text-center text-xs mb-4">
      {data.personalInfo.location} | {data.personalInfo.phone} | {data.personalInfo.email}
      {data.personalInfo.linkedin && ` | ${data.personalInfo.linkedin}`}
      {data.personalInfo.portfolio && ` | ${data.personalInfo.portfolio}`}
    </p>

    {data.careerObjective && (
      <section className="mb-4">
        <h2 className="text-md font-bold tracking-wider uppercase border-b border-gray-400 pb-1 mb-2 font-headline">Objective</h2>
        <p className="text-xs">{data.careerObjective}</p>
      </section>
    )}
    
    {data.skills && (
      <section className="mb-4">
        <h2 className="text-md font-bold tracking-wider uppercase border-b border-gray-400 pb-1 mb-2 font-headline">Skills</h2>
        <p className="text-xs leading-relaxed">{data.skills}</p>
      </section>
    )}

    {data.workExperience.length > 0 && (
      <section className="mb-4">
        <h2 className="text-md font-bold tracking-wider uppercase border-b border-gray-400 pb-1 mb-2 font-headline">Experience</h2>
        {data.workExperience.map(exp => (
          <div key={exp.id} className="mb-3 text-xs">
            <div className="flex justify-between">
              <h3 className="font-bold">{exp.jobTitle}, <span className="italic">{exp.companyName}</span></h3>
              <span className="text-gray-600">{exp.startDate} - {exp.endDate}</span>
            </div>
            <p className="text-gray-600 mb-1">{exp.location}</p>
            <ul className="list-disc list-inside ml-4 text-xs">
              {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        ))}
      </section>
    )}
    
    {data.education.length > 0 && (
       <section className="mb-4">
        <h2 className="text-md font-bold tracking-wider uppercase border-b border-gray-400 pb-1 mb-2 font-headline">Education</h2>
        {data.education.map(edu => (
          <div key={edu.id} className="mb-2 text-xs">
             <div className="flex justify-between">
              <h3 className="font-bold">{edu.degreeTitle}, <span className="italic">{edu.universityName}</span></h3>
               <span className="text-gray-600">{edu.graduationYear}</span>
            </div>
            {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
          </div>
        ))}
      </section>
    )}
    <p className="text-center text-xs mt-6 text-gray-400">Classic Template</p>
  </div>
);


interface ResumePreviewProps {
  data: ResumeData;
  template: ResumeTemplate;
}

export function ResumePreview({ data, template }: ResumePreviewProps) {
  const renderTemplate = () => {
    switch (template) {
      case 'Minimal':
        return <MinimalTemplate data={data} />;
      case 'Modern':
        return <ModernTemplate data={data} />;
      case 'Classic':
        return <ClassicTemplate data={data} />;
      default:
        return <ModernTemplate data={data} />; // Default to Modern
    }
  };

  return (
    <Card className="sticky top-4 h-[calc(100vh-2rem)] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Eye className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg font-medium font-headline">Resume Preview</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full w-full p-4 bg-muted/50">
            <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none" style={{ minHeight: '297mm' }}> {/* A4-like aspect ratio */}
                 {renderTemplate()}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
