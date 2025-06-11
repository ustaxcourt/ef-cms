import { Selectable, Insertable, Updateable } from 'kysely';

const DEFAULT = {};

export const requestTableDefinition = {
  requestId: DEFAULT as string,
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

export const responseChunkTableDefinition = {
  chunk: DEFAULT as string,
  index: DEFAULT as number,
  requestId: DEFAULT as string,
  totalNumberOfChunks: DEFAULT as number,
  ttl: DEFAULT as number,
  userId: DEFAULT as string,
};

export type ResponseChunkTable = typeof responseChunkTableDefinition;
export const DW_RESPONSE_CHUNK_COLUMNS = Object.keys(
  responseChunkTableDefinition,
) as Array<keyof ResponseChunkTable>;

export type ResponseChunkKysely = Selectable<ResponseChunkTable>;
export type NewResponseChunkKysely = Insertable<ResponseChunkTable>;
export type UpdateaResponseChunkKysely = Updateable<ResponseChunkTable>;

export type ResponseChunk = {
  chunk: string;
  index: number;
  requestId: string;
  totalNumberOfChunks: number;
};
