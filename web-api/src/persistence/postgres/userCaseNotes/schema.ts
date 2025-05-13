import { Selectable, Insertable, Updateable } from 'kysely';

const DEFAULT = {};

export const userCaseNoteTableDefinition = {
  docketNumber: DEFAULT as string,
  userId: DEFAULT as string,
  notes: DEFAULT as string | undefined,
};

export type UserCaseNoteTable = typeof userCaseNoteTableDefinition;

export const DW_USER_CASE_NOTE_COLUMNS = Object.keys(
  userCaseNoteTableDefinition,
) as Array<keyof UserCaseNoteTable>;

export type UserCaseNoteKysely = Selectable<UserCaseNoteTable>;
export type NewUserCaseNoteKysely = Insertable<UserCaseNoteTable>;
export type UpdateUserCaseNoteKysely = Updateable<UserCaseNoteTable>;
