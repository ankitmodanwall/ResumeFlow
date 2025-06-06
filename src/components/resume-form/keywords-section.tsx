"use client";

import React, { useState } from 'react';
import type { ResumeData } from '@/lib/types';
import { TextAreaField } from '@/components/form-elements';
import { ResumeFormSection } from '@/components/resume-form-section';
import { Button } from '@/components/ui/button';
import { Key, Zap, Loader2 } from 'lucide-react';
import { suggestKeywords, type SuggestKeywordsInput } from '@/ai/flows/keyword-suggestions';
import { useToast } from "@/hooks/use-toast";

interface KeywordsSectionProps {
  resumeData: ResumeData; // Pass full resume data for context
  onChange: (keywords: string) => void;
}

export function KeywordsSection({ resumeData, onChange }: KeywordsSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggestKeywords = async () => {
    setIsLoading(true);
    try {
      const workExperienceSummary = resumeData.workExperience
        .map(exp => `${exp.jobTitle} at ${exp.companyName}: ${exp.responsibilities.join(', ')}`)
        .join('\n');
      const educationSummary = resumeData.education
        .map(edu => `${edu.degreeTitle} from ${edu.universityName} (${edu.graduationYear})`)
        .join('\n');

      const input: SuggestKeywordsInput = {
        careerObjective: resumeData.careerObjective,
        skills: resumeData.skills,
        workExperience: workExperienceSummary,
        education: educationSummary,
        keywords: resumeData.keywords,
      };
      
      const result = await suggestKeywords(input);
      
      if (result.suggestedKeywords) {
        const currentKeywords = resumeData.keywords ? resumeData.keywords.split(',').map(k => k.trim()) : [];
        const suggested = result.suggestedKeywords.split(',').map(k => k.trim());
        const newKeywords = [...new Set([...currentKeywords, ...suggested])].filter(k => k).join(', ');
        onChange(newKeywords);
        toast({
          title: "Keywords Suggested",
          description: "New keywords have been added to your list.",
        });
      } else {
        toast({
          title: "No New Keywords",
          description: "The AI couldn't suggest additional keywords based on the current information.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error suggesting keywords:", error);
      toast({
        title: "Error",
        description: "Could not suggest keywords. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResumeFormSection title="Keywords (Optional, but great for ATS!)" icon={Key}>
      <TextAreaField
        id="keywords"
        label="Job-related keywords (comma-separated)"
        value={resumeData.keywords}
        onChange={onChange}
        placeholder="e.g., Software Development, Project Management, Data Analysis"
      />
      <p className="text-xs text-muted-foreground mt-1">Separate keywords with a comma.</p>
      <Button onClick={handleSuggestKeywords} disabled={isLoading} className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Zap className="mr-2 h-4 w-4" />
        )}
        Suggest Keywords (AI)
      </Button>
    </ResumeFormSection>
  );
}
