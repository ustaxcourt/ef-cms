import { Selectable, Insertable, Updateable, ColumnType } from 'kysely';

const DEFAULT = {};

export const userTableDefinition = {
  address1: DEFAULT as string | undefined, // forced optional
  address2: DEFAULT as string | undefined,
  address3: DEFAULT as string | undefined,
  city: DEFAULT as string | undefined, // forced optional
  country: DEFAULT as string | undefined, // forced optional
  countryType: DEFAULT as string | undefined, // forced optional
  email: DEFAULT as string | undefined,
  isSeniorJudge: DEFAULT as boolean | undefined,
  isUpdatingInformation: DEFAULT as boolean | undefined,
  judgeFullName: DEFAULT as string | undefined,
  judgePhoneNumber: DEFAULT as string | undefined,
  judgeTitle: DEFAULT as string | undefined,
  name: DEFAULT as string,
  pendingEmail: DEFAULT as string | undefined,
  pendingEmailVerificationToken: DEFAULT as string | undefined,
  pendingEmailVerificationTokenTimestamp: DEFAULT as Date | undefined,
  phone: DEFAULT as string | undefined, // forced optional
  postalCode: DEFAULT as string | undefined, // forced optional
  role: DEFAULT as string,
  section: DEFAULT as string | undefined,
  state: DEFAULT as string | undefined, // forced optional
  token: DEFAULT as string | undefined,
  userId: DEFAULT as string,
  entityName: DEFAULT as string | undefined,
};

export type UserTable = typeof userTableDefinition;

export const DW_USER_COLUMNS = Object.keys(userTableDefinition) as Array<
  keyof UserTable
>;

export type UserKysely = Selectable<UserTable>;
export type NewUserKysely = Insertable<UserTable>;
export type UpdateUserKysely = Updateable<UserTable>;

export const userConfirmationCodeTableDefinition = {
  id: DEFAULT as string,
  userId: DEFAULT as string,
  confirmationCode: DEFAULT as string,
  expiresAt: DEFAULT as Date,
};

export type UserConfirmationCodeTable =
  typeof userConfirmationCodeTableDefinition;

export const DW_USER_CONFIRMATION_CODE_COLUMNS = Object.keys(
  userConfirmationCodeTableDefinition,
) as Array<keyof UserConfirmationCodeTable>;

export type UserConfirmationCodeKysely = Selectable<UserConfirmationCodeTable>;
export type NewUserConfirmationCodeKysely =
  Insertable<UserConfirmationCodeTable>;
export type UpdateUserConfirmationCodeKysely =
  Updateable<UserConfirmationCodeTable>;

export const userOnCaseTableDefinition = {
  id: DEFAULT as string,
  userId: DEFAULT as string,
  docketNumber: DEFAULT as string,
  representing: DEFAULT as ColumnType<string[], string, string> | undefined,
  entityName: DEFAULT as string | undefined,
};

export type UserOnCaseTable = typeof userOnCaseTableDefinition;

export const DW_USER_ON_CASE_COLUMNS = Object.keys(
  userOnCaseTableDefinition,
) as Array<keyof UserOnCaseTable>;

export type UserOnCaseKysely = Selectable<UserOnCaseTable>;
export type NewUserOnCaseKysely = Insertable<UserOnCaseTable>;
export type UpdateUserOnCaseKysely = Updateable<UserOnCaseTable>;
