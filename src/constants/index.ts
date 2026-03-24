/**
 * Core application constants.
 * These govern business logic boundaries and standard parameters
 * as defined in the Business Logic & Rules Document.
 */

// File constraints
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_MIME_TYPES = ['application/pdf'];
export const MAX_ORIGINAL_FILENAME_LENGTH = 255;

// Job Description validation
export const MIN_JOB_DESCRIPTION_LENGTH = 20;
export const MAX_JOB_DESCRIPTION_LENGTH = 5000;

// Gemini configuration
export const GEMINI_RETRY_ATTEMPTS = 3;

// Application defaults
export const SESSION_RETENTION_DAYS = 7;
