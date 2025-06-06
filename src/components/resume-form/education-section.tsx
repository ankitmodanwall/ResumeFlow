"use client";

import type React from 'react';
import type { EducationEntry } from '@/lib/types';
import { InputField, ArrayEntryField } from '@/components/form-elements';
import { ResumeFormSection } from '@/components/resume-form-section';
import { Button } from '@/components/ui/button';
import { GraduationCap, PlusCircle } from 'lucide-react';

interface EducationSectionProps {
  data: EducationEntry[];
  onChange: (updatedEntries: EducationEntry[]) => void;
}

export function EducationSection({ data, onChange }: EducationSectionProps) {
  const addEntry = () => {
    const newEntry: EducationEntry = {
      id: crypto.randomUUID(),
      degreeTitle: '',
      universityName: '',
      graduationYear: '',
      gpa: '',
    };
    onChange([...data, newEntry]);
  };

  const updateEntry = (index: number, field: keyof EducationEntry, value: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const removeEntry = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  return (
    <ResumeFormSection
      title="Education"
      icon={GraduationCap}
      actions={
        <Button variant="outline" size="sm" onClick={addEntry}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Education
        </Button>
      }
    >
      {data.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No education entries added yet. Click "Add Education" to start.
        </p>
      )}
      <div className="space-y-6">
        {data.map((entry, index) => (
           <ArrayEntryField
            key={entry.id}
            entry={entry}
            index={index}
            onUpdate={(idx, field, val) => updateEntry(idx, field as keyof EducationEntry, val)}
            onRemove={removeEntry}
            fieldsContainerClassName="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {(currentEntry, currentIndex, currentUpdate) => (
              <>
                <InputField
                  id={`degreeTitle-${currentIndex}`}
                  label="Degree Title"
                  value={currentEntry.degreeTitle}
                  onChange={(val) => currentUpdate(currentIndex, 'degreeTitle', val)}
                  placeholder="e.g., B.Tech in Computer Science"
                  required
                />
                <InputField
                  id={`universityName-${currentIndex}`}
                  label="University/Institute Name"
                  value={currentEntry.universityName}
                  onChange={(val) => currentUpdate(currentIndex, 'universityName', val)}
                  placeholder="e.g., State University"
                  required
                />
                <InputField
                  id={`graduationYear-${currentIndex}`}
                  label="Graduation Year (YYYY)"
                  value={currentEntry.graduationYear}
                  onChange={(val) => currentUpdate(currentIndex, 'graduationYear', val)}
                  placeholder="e.g., 2020"
                  required
                />
                <InputField
                  id={`gpa-${currentIndex}`}
                  label="GPA (Optional)"
                  value={currentEntry.gpa || ''}
                  onChange={(val) => currentUpdate(currentIndex, 'gpa', val)}
                  placeholder="e.g., 3.8/4.0"
                />
              </>
            )}
          </ArrayEntryField>
        ))}
      </div>
    </ResumeFormSection>
  );
}
