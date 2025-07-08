import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

const DEFAULT = {};

const userOnCaseTableDefinition = {
  userId: DEFAULT as string,
  docketNumber: DEFAULT as string,
  representing: DEFAULT as ColumnType<string[], string, string> | null,
  serviceIndicator: DEFAULT as string | null,
};

export type UserOnCaseTable = typeof userOnCaseTableDefinition;

export const DW_USER_ON_CASE_COLUMNS = Object.keys(
  userOnCaseTableDefinition,
) as Array<keyof UserOnCaseTable>;

export type UserOnCaseKysely = Selectable<UserOnCaseTable>;
export type NewUserOnCaseKysely = Insertable<UserOnCaseTable>;
export type UpdateUserOnCaseKysely = Updateable<UserOnCaseTable>;
