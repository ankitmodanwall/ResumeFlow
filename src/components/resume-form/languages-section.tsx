"use client";

import type React from 'react';
import type { LanguageEntry } from '@/lib/types';
import { InputField, ArrayEntryField } from '@/components/form-elements';
import { ResumeFormSection } from '@/components/resume-form-section';
import { Button } from '@/components/ui/button';
import { Languages as LanguagesIcon, PlusCircle } from 'lucide-react'; // Renamed to avoid conflict with component name

interface LanguagesSectionProps {
  data: LanguageEntry[];
  onChange: (updatedEntries: LanguageEntry[]) => void;
}

export function LanguagesSection({ data, onChange }: LanguagesSectionProps) {
  const addEntry = () => {
    const newEntry: LanguageEntry = {
      id: crypto.randomUUID(),
      language: '',
      proficiency: '',
    };
    onChange([...data, newEntry]);
  };

  const updateEntry = (index: number, field: keyof LanguageEntry, value: string) => {
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
      title="Languages (Optional)"
      icon={LanguagesIcon}
      actions={
        <Button variant="outline" size="sm" onClick={addEntry}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Language
        </Button>
      }
    >
      {data.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">No languages added.</p>
      )}
      <div className="space-y-6">
        {data.map((entry, index) => (
          <ArrayEntryField
            key={entry.id}
            entry={entry}
            index={index}
            onUpdate={(idx, field, val) => updateEntry(idx, field as keyof LanguageEntry, val)}
            onRemove={removeEntry}
            fieldsContainerClassName="grid grid-cols-2 gap-4 items-end"
          >
            {(currentEntry, currentIndex, currentUpdate) => (
              <>
                <InputField
                  id={`languageName-${currentIndex}`}
                  label="Language"
                  value={currentEntry.language}
                  onChange={(val) => currentUpdate(currentIndex, 'language', val)}
                  placeholder="e.g., English"
                />
                <InputField
                  id={`languageProficiency-${currentIndex}`}
                  label="Proficiency"
                  value={currentEntry.proficiency}
                  onChange={(val) => currentUpdate(currentIndex, 'proficiency', val)}
                  placeholder="e.g., Fluent, Native, Conversational"
                />
              </>
            )}
          </ArrayEntryField>
        ))}
      </div>
    </ResumeFormSection>
  );
}
