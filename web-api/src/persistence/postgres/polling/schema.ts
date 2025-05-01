import { Selectable, Insertable, Updateable } from 'kysely';

const DEFAULT = {};

// Request table definition
export const requestTableDefinition = {
  createdAt: DEFAULT as Date,
  id: DEFAULT as number,
  requestId: DEFAULT as string,
  status: DEFAULT as string,
  totalChunks: DEFAULT as number,
  userId: DEFAULT as string,
};

// Define types for the request table
export type RequestRecord = typeof requestTableDefinition;
export type SelectableRequestRecord = Selectable<RequestRecord>;
export type InsertableRequestRecord = Insertable<RequestRecord>;
export type UpdateableRequestRecord = Updateable<RequestRecord>;

// Response chunks table definition
export const responseChunkTableDefinition = {
  chunk: DEFAULT as string,
  createdAt: DEFAULT as Date,
  id: DEFAULT as number,
  index: DEFAULT as number,
  requestId: DEFAULT as string,
  totalNumberOfChunks: DEFAULT as number,
  userId: DEFAULT as string,
};

// Define types for the ResponseChunk table
export type ResponseChunkRecord = typeof responseChunkTableDefinition;
export type SelectableResponseChunkRecord = Selectable<ResponseChunkRecord>;
export type InsertableResponseChunkRecord = Insertable<ResponseChunkRecord>;
export type UpdateableResponseChunkRecord = Updateable<ResponseChunkRecord>;

// Export the Response Chunk type for use in functions
export type ResponseChunk = {
  chunk: string;
  index: number;
  requestId: string;
  totalNumberOfChunks: number;
};