import { Selectable, Insertable, Updateable } from 'kysely';

const DEFAULT = {};

export const responseStringTableDefinition = {
  responseString: DEFAULT as string,
  requestId: DEFAULT as string,
  ttl: DEFAULT as number,
  userId: DEFAULT as string,
};

export type ResponseStringTable = typeof responseStringTableDefinition;
export const DW_RESPONSE_STRING_COLUMNS = Object.keys(
  responseStringTableDefinition,
) as Array<keyof ResponseStringTable>;

export type ResponseStringKysely = Selectable<ResponseStringTable>;
export type NewResponseStringKysely = Insertable<ResponseStringTable>;
export type UpdateResponseStringKysely = Updateable<ResponseStringTable>;

export type ResponseString = {
  responseString: string;
  requestId: string;
};
