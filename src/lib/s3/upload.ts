import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './client';
import pino from 'pino';
import { ALLOWED_MIME_TYPES } from '@/constants';

const logger = pino();
const BUCKET_NAME = process.env.S3_BUCKET_NAME || '';

/**
 * Uploads a resume PDF buffer to the corresponding S3 bucket prefix path.
 * 
 * @param sessionId The UUID of the session
 * @param resumeId The UUID of the specific resume
 * @param fileBuffer Buffer data of the PDF file
 * @param mimeType Mime-type identifier, must be in ALLOWED_MIME_TYPES
 * @returns The unique S3 key used to store the file
 */
export async function uploadResumeToS3(
  sessionId: string,
  resumeId: string,
  fileBuffer: Buffer | Uint8Array,
  mimeType: string = 'application/pdf'
): Promise<string> {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error('Invalid file type. Only PDF files are allowed.');
  }

  // Ensures S3_key never contains the original_filename as per BUSINESS_LOGIC R006
  const s3Key = `uploads/${sessionId}/${resumeId}`;
  
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: mimeType,
      ServerSideEncryption: 'AES256',
    });

    await s3Client.send(command);
    logger.info({ sessionId, resumeId, s3Key }, 'Successfully uploaded file to S3');
    
    return s3Key;
  } catch (error) {
    logger.error({ err: error, sessionId, resumeId }, 'Failed to upload file to S3 storage');
    throw new Error('Failed to upload file to storage');
  }
}
