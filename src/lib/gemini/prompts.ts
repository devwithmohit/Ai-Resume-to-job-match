/**
 * Builds the prompt used for Gemini AI processing
 * according to the rules structured in the Business Logic Document.
 */
export function buildScoringPrompt(jobDescription: string, resumeText: string): string {
  return `You are a recruiting assistant. Score this resume against the job description.

Job Description:
${jobDescription}

Resume Text:
${resumeText}

Return a JSON object with:
- score: integer 0-100
- reasoning: string explaining the score (2-3 sentences)

Consider:
- Required skills match
- Years of experience
- Relevant keywords
- Gaps or missing requirements

Formula:
- 90-100: Excellent match (meets/exceeds all key requirements)
- 70-89: Strong match (meets most requirements)
- 50-69: Partial match (meets some requirements)
- 25-49: Weak match (meets few requirements)
- 0-24: Poor match (does not meet requirements)

IMPORTANT: RESPOND ONLY WITH VALID JSON.`;
}
