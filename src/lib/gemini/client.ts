import { GoogleGenerativeAI } from '@google/generative-ai';
import pino from 'pino';
import { GEMINI_RETRY_ATTEMPTS } from '@/constants';
import { buildScoringPrompt } from './prompts';
import { parseGeminiResponse, ParsedGeminiResponse } from './parser';

const logger = pino();

export class GeminiApiError extends Error {
  constructor(message: string, public retryable: boolean = true) {
    super(message);
    this.name = 'GeminiApiError';
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculates the match score between a resume and job description.
 * Retries up to GEMINI_RETRY_ATTEMPTS with exponential backoff on failures.
 *
 * @param resumeText - Extracted text from the candidate's resume
 * @param jobDescription - The full job description text
 * @returns A promise containing the score (0-100) and reasoning
 * @throws {GeminiApiError} If the AI service fails after retries
 */
export async function getMatchScore(
  resumeText: string,
  jobDescription: string
): Promise<ParsedGeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiApiError('GEMINI_API_KEY is not configured', false);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Using 'gemini-pro' string natively supported
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const prompt = buildScoringPrompt(jobDescription, resumeText);

  let attempt = 0;
  let delayMs = 1000;

  while (attempt < GEMINI_RETRY_ATTEMPTS) {
    attempt++;
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      return parseGeminiResponse(text);
    } catch (error: any) {
      const isRateLimitOrTimeout =
        error?.status === 429 ||
        error?.message?.toLowerCase().includes('timeout') ||
        error?.status === 503;

      if (!isRateLimitOrTimeout && attempt === GEMINI_RETRY_ATTEMPTS) {
        logger.error({ err: error, attempt }, 'Gemini API call failed permanently');
        throw new GeminiApiError('Failed to generate score from AI after multiple attempts');
      }

      if (attempt < GEMINI_RETRY_ATTEMPTS) {
        logger.warn({ err: error, attempt, nextDelay: delayMs }, 'Gemini API call failed, retrying...');
        await sleep(delayMs);
        delayMs *= 2; // exponential backoff: 1s, 2s, 4s
      } else {
        logger.error({ err: error, attempt }, 'Gemini API call exhausted all retry attempts');
        throw new GeminiApiError('Max retries reached for Gemini API');
      }
    }
  }

  throw new GeminiApiError('Unexpected error during Gemini API call');
}
