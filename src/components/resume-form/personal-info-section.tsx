"use client";

import type React from 'react';
import type { PersonalInfo } from '@/lib/types';
import { InputField } from '@/components/form-elements';
import { ResumeFormSection } from '@/components/resume-form-section';
import { User } from 'lucide-react';

interface PersonalInfoSectionProps {
  data: PersonalInfo;
  onChange: (field: keyof PersonalInfo, value: string) => void;
}

export function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  return (
    <ResumeFormSection title="Personal Information" icon={User}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          id="fullName"
          label="Full Name"
          value={data.fullName}
          onChange={(value) => onChange('fullName', value)}
          placeholder="e.g., Jane Doe"
          required
        />
        <InputField
          id="email"
          label="Email Address"
          type="email"
          value={data.email}
          onChange={(value) => onChange('email', value)}
          placeholder="e.g., jane.doe@example.com"
          required
        />
        <InputField
          id="phone"
          label="Phone Number"
          type="tel"
          value={data.phone}
          onChange={(value) => onChange('phone', value)}
          placeholder="e.g., (123) 456-7890"
          required
        />
        <InputField
          id="location"
          label="Location"
          value={data.location}
          onChange={(value) => onChange('location', value)}
          placeholder="e.g., San Francisco, CA"
          required
        />
        <InputField
          id="linkedin"
          label="LinkedIn URL (Optional)"
          value={data.linkedin || ''}
          onChange={(value) => onChange('linkedin', value)}
          placeholder="e.g., linkedin.com/in/janedoe"
        />
        <InputField
          id="portfolio"
          label="Portfolio/GitHub (Optional)"
          value={data.portfolio || ''}
          onChange={(value) => onChange('portfolio', value)}
          placeholder="e.g., github.com/janedoe or janedoe.com"
        />
      </div>
    </ResumeFormSection>
  );
}
