import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { NewRequestKysely, NewResponseChunkKysely } from './schema';

const SIXTEEN_MINUTES = 16 * 60;

const getTtl = (ttl?: number): number => {
  return (
    ttl ?? Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS)) + SIXTEEN_MINUTES
  );
};

export const toKyselyNewRequest = (rawRequest: {
  requestId: string;
  userId: string;
  totalChunks?: number;
  ttl?: number;
}): NewRequestKysely => {
  const ttl = getTtl(rawRequest.ttl);

  return {
    requestId: rawRequest.requestId,
    userId: rawRequest.userId,
    totalChunks: rawRequest.totalChunks ?? 0,
    ttl,
  };
};

export const toKyselyNewResponseChunk = (rawChunk: {
  requestId: string;
  userId: string;
  chunk: string;
  index: number;
  totalNumberOfChunks: number;
  ttl?: number;
}): NewResponseChunkKysely => {
  const ttl = getTtl(rawChunk.ttl);

  return {
    requestId: rawChunk.requestId,
    userId: rawChunk.userId,
    chunk: rawChunk.chunk,
    index: rawChunk.index,
    totalNumberOfChunks: rawChunk.totalNumberOfChunks,
    ttl,
  };
};
