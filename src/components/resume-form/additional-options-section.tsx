
"use client";

import type React from 'react';
import { useState } from 'react';
import type { AdditionalOptions, ResumeTemplate, ExportFormat } from '@/lib/types';
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
  data: AdditionalOptions;
  onChange: (field: keyof AdditionalOptions, value: any) => void;
  fullName?: string; 
}

export function AdditionalOptionsSection({ data, onChange, fullName }: AdditionalOptionsSectionProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const resumeTemplates: ResumeTemplate[] = ['Minimal', 'Modern', 'Classic'];
  const exportFormats: ExportFormat[] = ['PDF', 'DOCX'];

  const handleExport = async () => {
    if (data.exportFormat === 'PDF') {
      const resumeElement = document.getElementById('printable-resume-area');
      if (!resumeElement) {
        toast({ title: "Error", description: "Resume preview element not found.", variant: "destructive" });
        return;
      }

      setIsExporting(true);
      
      const hiddenElements: HTMLElement[] = [];
      resumeElement.querySelectorAll('.print-hide').forEach(el => {
          hiddenElements.push(el as HTMLElement);
          (el as HTMLElement).style.display = 'none';
      });

      try {
        const canvas = await html2canvas(resumeElement, {
          scale: 2, // Higher scale for better resolution
          useCORS: true,
          logging: false,
          windowWidth: resumeElement.scrollWidth,
          windowHeight: resumeElement.scrollHeight,
        });

        hiddenElements.forEach(el => {
            el.style.display = ''; // Restore display
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
        
        const safeFullName = (fullName || 'resume').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${safeFullName}_resume.pdf`;
        pdf.save(filename);

        toast({ title: "Success", description: `Resume downloaded as ${filename}` });

      } catch (error) {
        console.error("Error generating PDF:", error);
        toast({ title: "Error", description: "Could not generate PDF. Please try again.", variant: "destructive" });
      } finally {
        setIsExporting(false);
      }

    } else if (data.exportFormat === 'DOCX') {
      toast({
          title: "Export Not Implemented",
          description: "DOCX export functionality is coming soon!",
          variant: "default"
      });
    }
  };


  return (
    <ResumeFormSection title="Additional Options" icon={Settings}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="resumeTemplate" className="text-sm font-medium mb-2 block">Choose Resume Template</Label>
           <Select
            value={data.template}
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
            value={data.exportFormat}
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
            checked={data.addCoverLetter}
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
              {isExporting && data.exportFormat === 'PDF' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting PDF...
                </>
              ) : (
                `Export Resume (${data.exportFormat})`
              )}
            </Button>
        </div>
      </div>
    </ResumeFormSection>
  );
}
