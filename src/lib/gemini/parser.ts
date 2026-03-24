import { z } from 'zod';
import pino from 'pino';

const logger = pino();

// Zod schema exactly reflecting the expected structured contract
const GeminiResponseSchema = z.object({
  score: z.union([z.number(), z.string()]).transform((val) => {
    let num = typeof val === 'string' ? parseFloat(val) : val;
    num = Math.round(num);
    if (num < 0) return 0;
    if (num > 100) return 100;
    return num;
  }),
  reasoning: z.string().catch(''),
});

export type ParsedGeminiResponse = z.infer<typeof GeminiResponseSchema>;

/**
 * Validates and coerces the raw string response from the Gemini API model
 * into a structured response interface via Zod parsing constraints, resolving edge-cases.
 */
export function parseGeminiResponse(rawContent: string): ParsedGeminiResponse {
  try {
    // 1. Strip markdown code fences if present 
    let jsonString = rawContent.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.slice(7);
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.slice(3);
    }
    if (jsonString.endsWith('```')) {
      jsonString = jsonString.slice(0, -3);
    }
    jsonString = jsonString.trim();

    // 2. Parse raw JSON
    const parsed = JSON.parse(jsonString);

    // 3. Schema validate & coerce
    const validatedData = GeminiResponseSchema.parse(parsed);

    return validatedData;
  } catch (error) {
    logger.error({ err: error, rawContent }, 'Failed to parse Gemini API response through Zod validation');
    throw new Error('Failed to parse AI response into scoring format');
  }
}
