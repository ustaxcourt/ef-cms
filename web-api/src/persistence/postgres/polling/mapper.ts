import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { NewRequestKysely, NewResponseChunkKysely } from './schema';

const SIXTEEN_MINUTES = 16 * 60;
/**
 * Convert application data to database format for dwRequest
 */
export const toKyselyNewRequest = (rawRequest: {
  requestId: string;
  userId: string;
  status?: string;
  totalChunks?: number;
  ttl?: number;
}): NewRequestKysely => {
  const ttl = Number(
    formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS) + SIXTEEN_MINUTES,
  );

  return {
    requestId: rawRequest.requestId,
    userId: rawRequest.userId,
    status: rawRequest.status || 'pending',
    totalChunks: rawRequest.totalChunks || 0,
    ttl,
  };
};

/**
 * Convert application data to database format for dwResponseChunk
 */
export const toKyselyNewResponseChunk = (rawChunk: {
  requestId: string;
  userId: string;
  chunk: string;
  index: number;
  totalNumberOfChunks: number;
  ttl?: number;
}): NewResponseChunkKysely => {
  const ttl = Number(
    formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS) + SIXTEEN_MINUTES,
  );

  return {
    requestId: rawChunk.requestId,
    userId: rawChunk.userId,
    chunk: rawChunk.chunk,
    index: rawChunk.index,
    totalNumberOfChunks: rawChunk.totalNumberOfChunks,
    ttl,
  };
};
