import { getMatchScore, GeminiApiError } from './client';

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockResolvedValue({
          response: {
            text: () => JSON.stringify({ score: 85, reasoning: 'Good match' })
          }
        })
      })
    }))
  };
});

describe('Gemini Client Service', () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully calculate a match score', async () => {
    const result = await getMatchScore('resume text sample', 'job description sample');
    expect(result.score).toBe(85);
    expect(result.reasoning).toBe('Good match');
  });

  it('should throw GeminiApiError if key is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    await expect(getMatchScore('test', 'test')).rejects.toThrow(GeminiApiError);
  });
});
