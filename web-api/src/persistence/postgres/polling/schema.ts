import { Selectable, Insertable, Updateable } from 'kysely';

const DEFAULT = {};

// Request table definition
export const requestTableDefinition = {
  requestId: DEFAULT as string,
  status: DEFAULT as string,
  totalChunks: DEFAULT as number | null,
  userId: DEFAULT as string,
  ttl: DEFAULT as number,
};

export type RequestTable = typeof requestTableDefinition;

export const DW_REQUEST_COLUMNS = Object.keys(requestTableDefinition) as Array<
  keyof RequestTable
>;

export type RequestKysely = Selectable<RequestTable>;
export type NewRequestKysely = Insertable<RequestTable>;
export type UpdateRequestKysely = Updateable<RequestTable>;

// Response chunks table definition
export const responseChunkTableDefinition = {
  chunk: DEFAULT as string,
  index: DEFAULT as number,
  requestId: DEFAULT as string,
  totalNumberOfChunks: DEFAULT as number,
  ttl: DEFAULT as number,
  userId: DEFAULT as string,
};

// Define types for the response_chunks table
export type ResponseChunkTable = typeof responseChunkTableDefinition;

export type ResponseChunkKysely = Selectable<ResponseChunkTable>;
export type NewResponseChunkKysely = Insertable<ResponseChunkTable>;
export type UpdateaResponseChunkKysely = Updateable<ResponseChunkTable>;
// Export the Response Chunk type for use in functions
export type ResponseChunk = {
  chunk: string;
  index: number;
  requestId: string;
  totalNumberOfChunks: number;
};
