'use server';
/**
 * @fileOverview This file implements a Genkit flow for suggesting issue categories
 * and refining descriptions based on user input for civic reports.
 *
 * - suggestCategoryAndRefineDescription - A function that handles the AI categorization and refinement process.
 * - AiReportCategorizationInput - The input type for the suggestCategoryAndRefineDescription function.
 * - AiReportCategorizationOutput - The return type for the suggestCategoryAndRefineDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CATEGORIES = [
  "Roads & Potholes",
  "Street Lighting",
  "Water & Drainage",
  "Waste Management",
  "Parks & Recreation",
  "Other"
] as const;

const AiReportCategorizationInputSchema = z.object({
  title: z.string().describe('The title of the reported issue.'),
  description: z.string().describe('The detailed description of the reported issue.'),
});
export type AiReportCategorizationInput = z.infer<typeof AiReportCategorizationInputSchema>;

const AiReportCategorizationOutputSchema = z.object({
  suggestedCategory: z.enum(CATEGORIES).describe('The most appropriate category for the reported issue.'),
  refinedDescription: z.string().describe('A refined version of the description for clarity and conciseness.'),
});
export type AiReportCategorizationOutput = z.infer<typeof AiReportCategorizationOutputSchema>;

export async function suggestCategoryAndRefineDescription(
  input: AiReportCategorizationInput
): Promise<AiReportCategorizationOutput> {
  return aiReportCategorizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiReportCategorizationPrompt',
  input: { schema: AiReportCategorizationInputSchema },
  output: { schema: AiReportCategorizationOutputSchema },
  prompt: `You are an AI assistant for a civic infrastructure reporting app called FixIt.
Your task is to analyze a citizen's report and provide a suggested category and a refined description for clarity and conciseness.

Available categories are: ${CATEGORIES.map(c => `"${c}"`).join(', ')}.

Report Title: {{{title}}}
Report Description: {{{description}}}

Based on the above, provide:
1. The single most appropriate category from the list above.
2. A refined version of the description that is clear, concise, and actionable for city officials, limited to a maximum of 200 characters.
`,
});

const aiReportCategorizationFlow = ai.defineFlow(
  {
    name: 'aiReportCategorizationFlow',
    inputSchema: AiReportCategorizationInputSchema,
    outputSchema: AiReportCategorizationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
