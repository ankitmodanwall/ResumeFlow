"use client";

import type React from 'react';
import type { AdditionalOptions, ResumeTemplate, ExportFormat } from '@/lib/types';
import { ResumeFormSection } from '@/components/resume-form-section';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface AdditionalOptionsSectionProps {
  data: AdditionalOptions;
  onChange: (field: keyof AdditionalOptions, value: any) => void;
}

export function AdditionalOptionsSection({ data, onChange }: AdditionalOptionsSectionProps) {
  const resumeTemplates: ResumeTemplate[] = ['Minimal', 'Modern', 'Classic'];
  const exportFormats: ExportFormat[] = ['PDF', 'DOCX'];

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
            onValueChange={(value: ExportFormat) => onChange('exportFormat', value)}
            className="flex space-x-4"
          >
            {exportFormats.map((format) => (
              <div key={format} className="flex items-center space-x-2">
                <RadioGroupItem value={format} id={`format-${format.toLowerCase()}`} />
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
                onClick={() => alert(`Exporting as ${data.exportFormat}... (Not implemented)`)}
                className="bg-primary hover:bg-primary/90"
            >
                Export Resume ({data.exportFormat})
            </Button>
        </div>
      </div>
    </ResumeFormSection>
  );
}
