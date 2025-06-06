"use client";

import type React from 'react';
import type { ProjectEntry } from '@/lib/types';
import { InputField, TextAreaField, ArrayEntryField } from '@/components/form-elements';
import { ResumeFormSection } from '@/components/resume-form-section';
import { Button } from '@/components/ui/button';
import { FolderKanban, PlusCircle } from 'lucide-react'; // Using FolderKanban for projects

interface ProjectsSectionProps {
  data: ProjectEntry[];
  onChange: (updatedEntries: ProjectEntry[]) => void;
}

export function ProjectsSection({ data, onChange }: ProjectsSectionProps) {
  const addEntry = () => {
    const newEntry: ProjectEntry = {
      id: crypto.randomUUID(),
      title: '',
      technologies: '',
      description: '',
      link: '',
    };
    onChange([...data, newEntry]);
  };

  const updateEntry = (index: number, field: keyof ProjectEntry, value: string) => {
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
      title="Projects (Optional)"
      icon={FolderKanban}
      actions={
        <Button variant="outline" size="sm" onClick={addEntry}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Project
        </Button>
      }
    >
      {data.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">No projects added.</p>
      )}
      <div className="space-y-6">
        {data.map((entry, index) => (
          <ArrayEntryField
            key={entry.id}
            entry={entry}
            index={index}
            onUpdate={(idx, field, val) => updateEntry(idx, field as keyof ProjectEntry, val)}
            onRemove={removeEntry}
          >
            {(currentEntry, currentIndex, currentUpdate) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  id={`projectTitle-${currentIndex}`}
                  label="Project Title"
                  value={currentEntry.title}
                  onChange={(val) => currentUpdate(currentIndex, 'title', val)}
                  placeholder="e.g., E-commerce Platform"
                />
                <InputField
                  id={`projectTech-${currentIndex}`}
                  label="Tools/Technologies Used (comma-separated)"
                  value={currentEntry.technologies}
                  onChange={(val) => currentUpdate(currentIndex, 'technologies', val)}
                  placeholder="e.g., React, Node.js, MongoDB"
                />
                <TextAreaField
                  id={`projectDesc-${currentIndex}`}
                  label="Description"
                  value={currentEntry.description}
                  onChange={(val) => currentUpdate(currentIndex, 'description', val)}
                  placeholder="Briefly describe your project"
                  className="md:col-span-2"
                />
                <InputField
                  id={`projectLink-${currentIndex}`}
                  label="Link (Optional)"
                  value={currentEntry.link || ''}
                  onChange={(val) => currentUpdate(currentIndex, 'link', val)}
                  placeholder="e.g., github.com/yourproject"
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
