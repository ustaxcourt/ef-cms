import { Selectable, Insertable, Updateable } from 'kysely';

const DEFAULT = {};

export const responseChunkTableDefinition = {
  responseString: DEFAULT as string,
  requestId: DEFAULT as string,
  ttl: DEFAULT as number,
  userId: DEFAULT as string,
};

export type ResponseStringTable = typeof responseChunkTableDefinition;
export const DW_RESPONSE_CHUNK_COLUMNS = Object.keys(
  responseChunkTableDefinition,
) as Array<keyof ResponseStringTable>;

export type ResponseChunkKysely = Selectable<ResponseStringTable>;
export type NewResponseChunkKysely = Insertable<ResponseStringTable>;
export type UpdateaResponseChunkKysely = Updateable<ResponseStringTable>;

export type ResponseChunk = {
  responseString: string;
  requestId: string;
};
