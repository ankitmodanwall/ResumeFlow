
"use client";

import React, { useState } from 'react';
import type { WorkExperienceEntry } from '@/lib/types';
import { InputField, TextAreaField, ArrayEntryField } from '@/components/form-elements';
import { ResumeFormSection } from '@/components/resume-form-section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Added import
import { Briefcase, PlusCircle, Trash2 } from 'lucide-react';

interface WorkExperienceSectionProps {
  data: WorkExperienceEntry[];
  onChange: (updatedEntries: WorkExperienceEntry[]) => void;
}

export function WorkExperienceSection({ data, onChange }: WorkExperienceSectionProps) {
  const addEntry = () => {
    const newEntry: WorkExperienceEntry = {
      id: crypto.randomUUID(),
      jobTitle: '',
      companyName: '',
      location: '',
      startDate: '',
      endDate: '',
      responsibilities: [''],
    };
    onChange([...data, newEntry]);
  };

  const updateEntry = (index: number, field: keyof WorkExperienceEntry, value: any) => {
    const newData = [...data];
    (newData[index] as any)[field] = value;
    onChange(newData);
  };
  
  const updateResponsibility = (entryIndex: number, respIndex: number, value: string) => {
    const newData = [...data];
    newData[entryIndex].responsibilities[respIndex] = value;
    onChange(newData);
  };

  const addResponsibility = (entryIndex: number) => {
    const newData = [...data];
    newData[entryIndex].responsibilities.push('');
    onChange(newData);
  };

  const removeResponsibility = (entryIndex: number, respIndex: number) => {
    const newData = [...data];
    newData[entryIndex].responsibilities.splice(respIndex, 1);
    // Ensure at least one responsibility input remains if array becomes empty
    if (newData[entryIndex].responsibilities.length === 0) {
      newData[entryIndex].responsibilities.push('');
    }
    onChange(newData);
  };

  const removeEntry = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  return (
    <ResumeFormSection
      title="Work Experience"
      icon={Briefcase}
      actions={
        <Button variant="outline" size="sm" onClick={addEntry}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      }
    >
      {data.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No work experience added yet. Click "Add Experience" to start.
        </p>
      )}
      <div className="space-y-6">
        {data.map((entry, index) => (
          <ArrayEntryField
            key={entry.id}
            entry={entry}
            index={index}
            onUpdate={updateEntry}
            onRemove={removeEntry}
            fieldsContainerClassName="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {(currentEntry, currentIndex, currentUpdate) => (
              <>
                <InputField
                  id={`jobTitle-${currentIndex}`}
                  label="Job Title"
                  value={currentEntry.jobTitle}
                  onChange={(val) => currentUpdate(currentIndex, 'jobTitle', val)}
                  placeholder="e.g., Software Engineer"
                  required
                />
                <InputField
                  id={`companyName-${currentIndex}`}
                  label="Company Name"
                  value={currentEntry.companyName}
                  onChange={(val) => currentUpdate(currentIndex, 'companyName', val)}
                  placeholder="e.g., Tech Solutions Inc."
                  required
                />
                <InputField
                  id={`location-${currentIndex}`}
                  label="Location"
                  value={currentEntry.location}
                  onChange={(val) => currentUpdate(currentIndex, 'location', val)}
                  placeholder="e.g., New York, NY"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    id={`startDate-${currentIndex}`}
                    label="Start Date (MM/YYYY)"
                    value={currentEntry.startDate}
                    onChange={(val) => currentUpdate(currentIndex, 'startDate', val)}
                    placeholder="e.g., 06/2018"
                    required
                  />
                  <InputField
                    id={`endDate-${currentIndex}`}
                    label="End Date (MM/YYYY)"
                    value={currentEntry.endDate}
                    onChange={(val) => currentUpdate(currentIndex, 'endDate', val)}
                    placeholder="e.g., 12/2022 or Present"
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Key Responsibilities / Achievements</label>
                  {currentEntry.responsibilities.map((resp, respIndex) => (
                    <div key={respIndex} className="flex items-center gap-2">
                      <Input
                        value={resp}
                        onChange={(e) => updateResponsibility(currentIndex, respIndex, e.target.value)}
                        placeholder={`Responsibility ${respIndex + 1}`}
                        className="flex-grow"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeResponsibility(currentIndex, respIndex)}
                        disabled={currentEntry.responsibilities.length === 1 && respIndex === 0}
                        aria-label="Remove responsibility"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addResponsibility(currentIndex)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Responsibility
                  </Button>
                </div>
              </>
            )}
          </ArrayEntryField>
        ))}
      </div>
    </ResumeFormSection>
  );
}

