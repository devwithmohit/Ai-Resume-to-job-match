import { z } from 'zod';
import { MIN_JOB_DESCRIPTION_LENGTH, MAX_JOB_DESCRIPTION_LENGTH } from '@/constants';

export const createSessionSchema = z.object({
  jobDescription: z.string({
    required_error: 'jobDescription is required.',
  })
    .min(MIN_JOB_DESCRIPTION_LENGTH, `Job description is required and must be between 20 and 5000 characters.`)
    .max(MAX_JOB_DESCRIPTION_LENGTH, `Job description is required and must be between 20 and 5000 characters.`)
    .nonempty('jobDescription is required.'),
});

// UUID v4 format strictly required
export const uuidSchema = z.string().uuid('Invalid session ID format.');
