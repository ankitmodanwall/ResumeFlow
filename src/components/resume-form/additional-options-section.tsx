
"use client";

import type React from 'react';
import { useState } from 'react';
import type { AdditionalOptions, ResumeTemplate, ExportFormat, ResumeData } from '@/lib/types';
import { ResumeFormSection } from '@/components/resume-form-section';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Settings, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


interface AdditionalOptionsSectionProps {
  options: AdditionalOptions;
  resumeData: ResumeData;
  onChange: (field: keyof AdditionalOptions, value: any) => void;
}

const generateBasicDocHtml = (data: ResumeData): string => {
  const escapeHtml = (unsafe: string | undefined): string => 
    unsafe ? unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;") : '';

  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Resume - ${escapeHtml(data.personalInfo.fullName)}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        h1, h2, h3 { margin-bottom: 0.5em; }
        h1 { font-size: 24px; text-align: center; }
        h2 { font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 0.3em; margin-top: 1.5em; }
        h3 { font-size: 16px; }
        p, ul { margin-bottom: 1em; }
        ul { padding-left: 20px; }
        .contact-info { text-align: center; margin-bottom: 1.5em; }
        .section { margin-bottom: 1.5em; }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(data.personalInfo.fullName)}</h1>
      <div class="contact-info">
        <p>
          ${escapeHtml(data.personalInfo.email)} | 
          ${escapeHtml(data.personalInfo.phone)} | 
          ${escapeHtml(data.personalInfo.location)}
        </p>
        ${data.personalInfo.linkedin ? `<p>LinkedIn: ${escapeHtml(data.personalInfo.linkedin)}</p>` : ''}
        ${data.personalInfo.portfolio ? `<p>Portfolio: ${escapeHtml(data.personalInfo.portfolio)}</p>` : ''}
      </div>`;

  if (data.careerObjective) {
    html += `
      <div class="section">
        <h2>Summary</h2>
        <p>${escapeHtml(data.careerObjective)}</p>
      </div>`;
  }

  if (data.skills) {
    html += `
      <div class="section">
        <h2>Skills</h2>
        <p>${escapeHtml(data.skills)}</p>
      </div>`;
  }

  if (data.workExperience.length > 0) {
    html += `
      <div class="section">
        <h2>Work Experience</h2>`;
    data.workExperience.forEach(exp => {
      html += `
        <div>
          <h3>${escapeHtml(exp.jobTitle)} at ${escapeHtml(exp.companyName)}</h3>
          <p><em>${escapeHtml(exp.location)} | ${escapeHtml(exp.startDate)} - ${escapeHtml(exp.endDate)}</em></p>
          <ul>${exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
        </div>`;
    });
    html += `</div>`;
  }

  if (data.education.length > 0) {
    html += `
      <div class="section">
        <h2>Education</h2>`;
    data.education.forEach(edu => {
      html += `
        <div>
          <h3>${escapeHtml(edu.degreeTitle)} - ${escapeHtml(edu.universityName)}</h3>
          <p><em>Graduated: ${escapeHtml(edu.graduationYear)}${edu.gpa ? ` | GPA: ${escapeHtml(edu.gpa)}` : ''}</em></p>
        </div>`;
    });
    html += `</div>`;
  }
  
  if (data.certifications.length > 0) {
    html += `
      <div class="section">
        <h2>Certifications</h2>`;
    data.certifications.forEach(cert => {
      html += `
        <div>
          <h3>${escapeHtml(cert.name)}</h3>
          <p><em>${escapeHtml(cert.issuedBy)} - ${escapeHtml(cert.completionDate)}</em></p>
        </div>`;
    });
    html += `</div>`;
  }

  if (data.projects.length > 0) {
    html += `
      <div class="section">
        <h2>Projects</h2>`;
    data.projects.forEach(proj => {
      html += `
        <div>
          <h3>${escapeHtml(proj.title)}</h3>
          <p><em>Technologies: ${escapeHtml(proj.technologies)}</em></p>
          <p>${escapeHtml(proj.description)}</p>
          ${proj.link ? `<p>Link: <a href="${escapeHtml(proj.link)}">${escapeHtml(proj.link)}</a></p>` : ''}
        </div>`;
    });
    html += `</div>`;
  }
  
   if (data.awards.length > 0) {
    html += `
      <div class="section">
        <h2>Awards</h2>`;
    data.awards.forEach(award => {
      html += `
        <div>
          <h3>${escapeHtml(award.name)}</h3>
          ${award.date ? `<p><em>Date: ${escapeHtml(award.date)}</em></p>` : ''}
          ${award.description ? `<p>${escapeHtml(award.description)}</p>` : ''}
        </div>`;
    });
    html += `</div>`;
  }

  if (data.languages.length > 0) {
    html += `
      <div class="section">
        <h2>Languages</h2>`;
    data.languages.forEach(lang => {
      html += `<p>${escapeHtml(lang.language)}: ${escapeHtml(lang.proficiency)}</p>`;
    });
    html += `</div>`;
  }
  
  if (data.keywords) {
    html += `
      <div class="section">
        <h2>Keywords</h2>
        <p>${escapeHtml(data.keywords)}</p>
      </div>`;
  }

  if (data.additionalOptions.addCoverLetter) {
    html += `
      <div class="section">
        <h2>Cover Letter</h2>
        <p>[Cover letter content would appear here if generated. This feature is currently a placeholder.]</p>
      </div>`;
  }

  html += `</body></html>`;
  return html;
};


export function AdditionalOptionsSection({ options, resumeData, onChange }: AdditionalOptionsSectionProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const resumeTemplates: ResumeTemplate[] = ['Minimal', 'Modern', 'Classic'];
  const exportFormats: ExportFormat[] = ['PDF', 'DOCX'];

  const handleExport = async () => {
    setIsExporting(true);
    const safeFullName = (resumeData.personalInfo.fullName || 'resume').replace(/[^a-z0-9]/gi, '_').toLowerCase();

    if (options.exportFormat === 'PDF') {
      const resumeElement = document.getElementById('printable-resume-area');
      if (!resumeElement) {
        toast({ title: "Error", description: "Resume preview element not found.", variant: "destructive" });
        setIsExporting(false);
        return;
      }
      
      const hiddenElements: HTMLElement[] = [];
      resumeElement.querySelectorAll('.print-hide').forEach(el => {
          hiddenElements.push(el as HTMLElement);
          (el as HTMLElement).style.display = 'none';
      });

      try {
        const canvas = await html2canvas(resumeElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: resumeElement.scrollWidth,
          windowHeight: resumeElement.scrollHeight,
        });

        hiddenElements.forEach(el => {
            el.style.display = '';
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgProps = pdf.getImageProperties(imgData);
        const aspectRatio = imgProps.width / imgProps.height;
        
        let newImgWidth = pdfWidth;
        let newImgHeight = newImgWidth / aspectRatio;

        if (newImgHeight > pdfHeight) {
          newImgHeight = pdfHeight;
          newImgWidth = newImgHeight * aspectRatio;
        }
        
        const xOffset = (pdfWidth - newImgWidth) / 2;
        const yOffset = (pdfHeight - newImgHeight) / 2;

        pdf.addImage(imgData, 'PNG', xOffset, yOffset, newImgWidth, newImgHeight);
        
        const filename = `${safeFullName}_resume.pdf`;
        pdf.save(filename);
        toast({ title: "Success", description: `Resume downloaded as ${filename}` });

      } catch (error) {
        console.error("Error generating PDF:", error);
        toast({ title: "Error", description: "Could not generate PDF. Please try again.", variant: "destructive" });
      }

    } else if (options.exportFormat === 'DOCX') {
      try {
        const htmlContent = generateBasicDocHtml(resumeData);
        const blob = new Blob([htmlContent], { type: 'application/msword' }); 
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const filename = `${safeFullName}_resume.doc`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        toast({ title: "Success", description: `Resume downloaded as ${filename}` });
      } catch (error) {
        console.error("Error generating DOCX:", error);
        toast({ title: "Error", description: "Could not generate DOCX. Please try again.", variant: "destructive" });
      }
    }
    setIsExporting(false);
  };


  return (
    <ResumeFormSection title="Additional Options" icon={Settings}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="resumeTemplate" className="text-sm font-medium mb-2 block">Choose Resume Template</Label>
           <Select
            value={options.template}
            onValueChange={(value: ResumeTemplate) => onChange('template', value)}
          >
            <SelectTrigger id="resumeTemplate" className="w-full md:w-[280px]">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {resumeTemplates.map((template) => (
                <SelectItem key={template} value={template}>
                  {template}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Export Format</Label>
          <RadioGroup
            value={options.exportFormat}
            onValueChange={(value: ExportFormat) => {
              if (!isExporting) onChange('exportFormat', value);
            }}
            className="flex space-x-4"
          >
            {exportFormats.map((format) => (
              <div key={format} className="flex items-center space-x-2">
                <RadioGroupItem value={format} id={`format-${format.toLowerCase()}`} disabled={isExporting} />
                <Label htmlFor={`format-${format.toLowerCase()}`} className="font-normal">{format}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="addCoverLetter"
            checked={options.addCoverLetter}
            onCheckedChange={(checked) => onChange('addCoverLetter', checked)}
          />
          <Label htmlFor="addCoverLetter" className="font-normal">Add Cover Letter (Placeholder)</Label>
        </div>
        
        <div className="flex space-x-2 mt-4">
            <Button 
                onClick={handleExport}
                disabled={isExporting}
                className="bg-primary hover:bg-primary/90 min-w-[220px]"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {`Exporting ${options.exportFormat}...`}
                </>
              ) : (
                `Export Resume (${options.exportFormat})`
              )}
            </Button>
        </div>
      </div>
    </ResumeFormSection>
  );
}

