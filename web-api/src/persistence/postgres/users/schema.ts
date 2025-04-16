import { Selectable, Insertable, Updateable } from 'kysely';

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
  userType: DEFAULT as string | undefined,
};

export type UserTable = typeof userTableDefinition;

export const DW_USER_COLUMNS = Object.keys(userTableDefinition) as Array<
  keyof UserTable
>;

export type UserKysely = Selectable<UserTable>;
export type NewUserKysely = Insertable<UserTable>;
export type UpdateUserKysely = Updateable<UserTable>;

export const practitionerTableDefinition = {
  practitionerId: DEFAULT as string,
  userId: DEFAULT as string | undefined, // Not all Practitioners have a corresponding User
  additionalPhone: DEFAULT as string | undefined,
  admissionsDate: DEFAULT as Date,
  admissionsStatus: DEFAULT as string,
  barNumber: DEFAULT as string,
  birthYear: DEFAULT as number,
  confirmEmail: DEFAULT as string | undefined,
  firmName: DEFAULT as string | undefined,
  firstName: DEFAULT as string,
  lastName: DEFAULT as string,
  middleName: DEFAULT as string | undefined,
  originalBarState: DEFAULT as string | undefined,
  practiceType: DEFAULT as string,
  practitionerNotes: DEFAULT as string | undefined,
  practitionerType: DEFAULT as string,
  representing: DEFAULT as any,
  serviceIndicator: DEFAULT as string,
  suffix: DEFAULT as string | undefined,
  updatedEmail: DEFAULT as string | undefined,
};

export type PractitionerTable = typeof practitionerTableDefinition;

export const DW_PRACTITIONER_COLUMNS = Object.keys(
  practitionerTableDefinition,
) as Array<keyof PractitionerTable>;

export type PractitionerKysely = Selectable<PractitionerTable>;
export type NewPractitionerKysely = Insertable<PractitionerTable>;
export type UpdatePractitionerKysely = Updateable<PractitionerTable>;

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
};

export type UserOnCaseTable = typeof userOnCaseTableDefinition;

export const DW_USER_ON_CASE_COLUMNS = Object.keys(
  userOnCaseTableDefinition,
) as Array<keyof UserOnCaseTable>;

export type UserOnCaseKysely = Selectable<UserOnCaseTable>;
export type NewUserOnCaseKysely = Insertable<UserOnCaseTable>;
export type UpdateUserOnCaseKysely = Updateable<UserOnCaseTable>;
