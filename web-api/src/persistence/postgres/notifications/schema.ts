import { Selectable, Insertable, Updateable } from 'kysely';

const DEFAULT = {};

export const connectionTableDefinition = {
  clientConnectionId: DEFAULT as string,
  connectionId: DEFAULT as string,
  endpoint: DEFAULT as string,
  userId: DEFAULT as string,
  expirationDate: DEFAULT as number,
};

export type ConnectionTable = typeof connectionTableDefinition;

export const DW_CONNECTION_COLUMNS = Object.keys(
  connectionTableDefinition,
) as Array<keyof ConnectionTable>;

export type ConnectionKysely = Selectable<ConnectionTable>;
export type NewConnectionKysely = Insertable<ConnectionTable>;
export type UpdateConnectionKysely = Updateable<ConnectionTable>;
