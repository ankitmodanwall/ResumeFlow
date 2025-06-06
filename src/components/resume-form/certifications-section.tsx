"use client";

import type React from 'react';
import type { CertificationEntry } from '@/lib/types';
import { InputField, ArrayEntryField } from '@/components/form-elements';
import { ResumeFormSection } from '@/components/resume-form-section';
import { Button } from '@/components/ui/button';
import { Award, PlusCircle } from 'lucide-react';

interface CertificationsSectionProps {
  data: CertificationEntry[];
  onChange: (updatedEntries: CertificationEntry[]) => void;
}

export function CertificationsSection({ data, onChange }: CertificationsSectionProps) {
  const addEntry = () => {
    const newEntry: CertificationEntry = {
      id: crypto.randomUUID(),
      name: '',
      issuedBy: '',
      completionDate: '',
    };
    onChange([...data, newEntry]);
  };

  const updateEntry = (index: number, field: keyof CertificationEntry, value: string) => {
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
      title="Certifications / Courses (Optional)"
      icon={Award}
      actions={
        <Button variant="outline" size="sm" onClick={addEntry}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Certification
        </Button>
      }
    >
      {data.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">No certifications added.</p>
      )}
      <div className="space-y-6">
        {data.map((entry, index) => (
          <ArrayEntryField
            key={entry.id}
            entry={entry}
            index={index}
            onUpdate={(idx, field, val) => updateEntry(idx, field as keyof CertificationEntry, val)}
            onRemove={removeEntry}
            fieldsContainerClassName="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
          >
            {(currentEntry, currentIndex, currentUpdate) => (
              <>
                <InputField
                  id={`certName-${currentIndex}`}
                  label="Name of Certification"
                  value={currentEntry.name}
                  onChange={(val) => currentUpdate(currentIndex, 'name', val)}
                  placeholder="e.g., AWS Certified Developer"
                />
                <InputField
                  id={`certIssuedBy-${currentIndex}`}
                  label="Issued By"
                  value={currentEntry.issuedBy}
                  onChange={(val) => currentUpdate(currentIndex, 'issuedBy', val)}
                  placeholder="e.g., Amazon Web Services"
                />
                <InputField
                  id={`certCompletionDate-${currentIndex}`}
                  label="Completion Date (MM/YYYY)"
                  value={currentEntry.completionDate}
                  onChange={(val) => currentUpdate(currentIndex, 'completionDate', val)}
                  placeholder="e.g., 03/2021"
                />
              </>
            )}
          </ArrayEntryField>
        ))}
      </div>
    </ResumeFormSection>
  );
}
