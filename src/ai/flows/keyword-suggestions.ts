'use server';

/**
 * @fileOverview Keyword suggestion AI agent.
 *
 * - suggestKeywords - A function that suggests keywords for resume optimization.
 * - SuggestKeywordsInput - The input type for the suggestKeywords function.
 * - SuggestKeywordsOutput - The return type for the suggestKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestKeywordsInputSchema = z.object({
  careerObjective: z.string().describe('Career objective or summary.'),
  skills: z.string().describe('List of skills.'),
  workExperience: z.string().describe('Summary of work experience.'),
  education: z.string().describe('Summary of education.'),
  keywords: z.string().optional().describe('List of keywords provided by the user.'),
});
export type SuggestKeywordsInput = z.infer<typeof SuggestKeywordsInputSchema>;

const SuggestKeywordsOutputSchema = z.object({
  suggestedKeywords: z
    .string()
    .describe('Suggested keywords for resume optimization.'),
});
export type SuggestKeywordsOutput = z.infer<typeof SuggestKeywordsOutputSchema>;

export async function suggestKeywords(input: SuggestKeywordsInput): Promise<SuggestKeywordsOutput> {
  return suggestKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestKeywordsPrompt',
  input: {schema: SuggestKeywordsInputSchema},
  output: {schema: SuggestKeywordsOutputSchema},
  prompt: `You are an expert resume optimization specialist. Your goal is to suggest relevant keywords that the user can add to their resume based on the information they provide.

  Consider the career objective, skills, work experience and education to make a determination of good keywords that would be relevant for the user to add to their resume.

  Career Objective: {{{careerObjective}}}
  Skills: {{{skills}}}
  Work Experience: {{{workExperience}}}
  Education: {{{education}}}
  Existing Keywords: {{{keywords}}}

  Suggest keywords that will help the user target specific roles. Return a comma separated list of keywords.`,
});

const suggestKeywordsFlow = ai.defineFlow(
  {
    name: 'suggestKeywordsFlow',
    inputSchema: SuggestKeywordsInputSchema,
    outputSchema: SuggestKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
