import { Insertable, Selectable, Updateable } from 'kysely';

const DEFAULT = {};

const userContactTableDefinition = {
  userId: DEFAULT as string,
  docketNumber: DEFAULT as string,
  lat: DEFAULT as number | null,
  lng: DEFAULT as number | null,
  geodataMatch: DEFAULT as boolean | null,
};

export type UserContactTable = typeof userContactTableDefinition;

export const DW_USER_CONTACT_COLUMNS = Object.keys(
  userContactTableDefinition,
) as Array<keyof UserContactTable>;

export type UserContactKysely = Selectable<UserContactTable>;
export type NewUserContactKysely = Insertable<UserContactTable>;
export type UpdateUserContactKysely = Updateable<UserContactTable>;
