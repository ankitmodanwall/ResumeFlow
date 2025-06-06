"use client";

import type React from 'react';
import { TextAreaField } from '@/components/form-elements';
import { ResumeFormSection } from '@/components/resume-form-section';
import { Wrench } from 'lucide-react'; // Changed from ListChecks for better semantic fit

interface SkillsSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function SkillsSection({ value, onChange }: SkillsSectionProps) {
  return (
    <ResumeFormSection title="Skills" icon={Wrench}>
      <TextAreaField
        id="skills"
        label="List technical & soft skills (comma-separated)"
        value={value}
        onChange={onChange}
        placeholder="e.g., Java, React, SQL, Team Leadership, Agile"
        required
      />
       <p className="text-xs text-muted-foreground mt-1">Separate skills with a comma.</p>
    </ResumeFormSection>
  );
}
