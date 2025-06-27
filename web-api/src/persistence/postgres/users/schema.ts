import { Selectable, Insertable, Updateable, ColumnType } from 'kysely';

const DEFAULT = {};

export const userTableDefinition = {
  address1: DEFAULT as string | null, // forced optional
  address2: DEFAULT as string | null,
  address3: DEFAULT as string | null,
  city: DEFAULT as string | null, // forced optional
  country: DEFAULT as string | null, // forced optional
  countryType: DEFAULT as string | null, // forced optional
  email: DEFAULT as string | null,
  isSeniorJudge: DEFAULT as boolean | null,
  isUpdatingInformation: DEFAULT as boolean | null,
  judgeFullName: DEFAULT as string | null,
  judgePhoneNumber: DEFAULT as string | null,
  judgeTitle: DEFAULT as string | null,
  name: DEFAULT as string,
  pendingEmail: DEFAULT as string | null,
  pendingEmailVerificationToken: DEFAULT as string | null,
  pendingEmailVerificationTokenTimestamp: DEFAULT as Date | null,
  phone: DEFAULT as string | null, // forced optional
  postalCode: DEFAULT as string | null, // forced optional
  role: DEFAULT as string,
  section: DEFAULT as string | null,
  state: DEFAULT as string | null, // forced optional
  token: DEFAULT as string | null,
  userId: DEFAULT as string,
  entityName: DEFAULT as string | null,
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
  ttl: DEFAULT as number,
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

// TODO: After 10495, consider redesiging userOnCase "pending" feature. As-is,
// when a practitioner submits a document that requires court approval before
// they are associated with the case, the system creates a "pending" case
// association. This "pending" association is never deleted: it is instead
// orphaned and effectvely overridden by the existence of a record in userOnCase
// that has the same userId-docketNumber combination. What we have below is
// effectively a one-to-one reimlementation of how these associations were
// stored in dynamodb.
export const userOnCasePendingTableDefinition = {
  userId: DEFAULT as string,
  docketNumber: DEFAULT as string,
};

export type UserOnCasePendingTable = typeof userOnCasePendingTableDefinition;

export const DW_USER_ON_CASE_PENDING_COLUMNS = Object.keys(
  userOnCasePendingTableDefinition,
) as Array<keyof UserOnCasePendingTable>;

export type UserOnCasePendingKysely = Selectable<UserOnCasePendingTable>;
export type NewUserOnCasePendingKysely = Insertable<UserOnCasePendingTable>;
export type UpdateUserOnCasePendingKysely = Updateable<UserOnCasePendingTable>;
