import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from './client';
import pino from 'pino';

const logger = pino();
const BUCKET_NAME = process.env.S3_BUCKET_NAME || '';

/**
 * Generates a presigned URL giving momentary access to the resume in storage
 */
export async function getResumeDownloadUrl(s3Key: string, expiresInSeconds: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });
    
    const url = await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
    return url;
  } catch (error) {
    logger.error({ err: error, s3Key }, 'Failed to generate signed URL for S3 object');
    throw new Error('Could not generate download URL');
  }
}

/**
 * Downloads the pure buffer data from S3, necessary for the Edge/Node function processing locally.
 */
export async function downloadResumeBuffer(s3Key: string): Promise<Uint8Array> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });
    
    const response = await s3Client.send(command);
    
    if (!response.Body) {
        throw new Error('S3 object body is empty');
    }
    
    const byteArray = await response.Body.transformToByteArray();
    return byteArray;
  } catch (error) {
    logger.error({ err: error, s3Key }, 'Failed to download internal resume buffer from S3');
    throw new Error('Could not retrieve file buffer from storage');
  }
}
