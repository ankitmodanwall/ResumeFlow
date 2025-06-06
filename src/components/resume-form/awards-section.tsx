"use client";

import type React from 'react';
import type { AwardEntry } from '@/lib/types';
import { InputField, TextAreaField, ArrayEntryField } from '@/components/form-elements';
import { ResumeFormSection } from '@/components/resume-form-section';
import { Button } from '@/components/ui/button';
import { Trophy, PlusCircle } from 'lucide-react';

interface AwardsSectionProps {
  data: AwardEntry[];
  onChange: (updatedEntries: AwardEntry[]) => void;
}

export function AwardsSection({ data, onChange }: AwardsSectionProps) {
  const addEntry = () => {
    const newEntry: AwardEntry = {
      id: crypto.randomUUID(),
      name: '',
      date: '',
      description: '',
    };
    onChange([...data, newEntry]);
  };

  const updateEntry = (index: number, field: keyof AwardEntry, value: string) => {
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
      title="Awards / Achievements (Optional)"
      icon={Trophy}
      actions={
        <Button variant="outline" size="sm" onClick={addEntry}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Award
        </Button>
      }
    >
      {data.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">No awards or achievements added.</p>
      )}
      <div className="space-y-6">
        {data.map((entry, index) => (
          <ArrayEntryField
            key={entry.id}
            entry={entry}
            index={index}
            onUpdate={(idx, field, val) => updateEntry(idx, field as keyof AwardEntry, val)}
            onRemove={removeEntry}
          >
            {(currentEntry, currentIndex, currentUpdate) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  id={`awardName-${currentIndex}`}
                  label="Award/Achievement Name"
                  value={currentEntry.name}
                  onChange={(val) => currentUpdate(currentIndex, 'name', val)}
                  placeholder="e.g., Dean's List, Hackathon Winner"
                />
                <InputField
                  id={`awardDate-${currentIndex}`}
                  label="Date (MM/YYYY, Optional)"
                  value={currentEntry.date || ''}
                  onChange={(val) => currentUpdate(currentIndex, 'date', val)}
                  placeholder="e.g., 05/2019"
                />
                <TextAreaField
                  id={`awardDesc-${currentIndex}`}
                  label="Description (Optional)"
                  value={currentEntry.description || ''}
                  onChange={(val) => currentUpdate(currentIndex, 'description', val)}
                  placeholder="Briefly describe the award or achievement"
                  className="md:col-span-2"
                />
              </div>
            )}
          </ArrayEntryField>
        ))}
      </div>
    </ResumeFormSection>
  );
}
