"use client";

import type React from 'react';
import { TextAreaField } from '@/components/form-elements';
import { ResumeFormSection } from '@/components/resume-form-section';
import { Target } from 'lucide-react';

interface CareerObjectiveSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function CareerObjectiveSection({ value, onChange }: CareerObjectiveSectionProps) {
  return (
    <ResumeFormSection title="Career Objective or Summary" icon={Target}>
      <TextAreaField
        id="careerObjective"
        label="1–3 sentences about your goals and expertise"
        value={value}
        onChange={onChange}
        placeholder="e.g., Highly motivated software engineer with 5+ years of experience..."
        required
      />
    </ResumeFormSection>
  );
}
