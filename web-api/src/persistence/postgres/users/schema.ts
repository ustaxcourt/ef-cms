import { Selectable, Insertable, Updateable } from 'kysely';

const DEFAULT = {};

export const userTableDefinition = {
  address1: DEFAULT as string | undefined, // forced optional
  address2: DEFAULT as string | undefined,
  address3: DEFAULT as string | undefined,
  admissionsDate: DEFAULT as Date | undefined,
  admissionsStatus: DEFAULT as string | undefined,
  barNumber: DEFAULT as string | undefined,
  birthYear: DEFAULT as number | undefined,
  city: DEFAULT as string | undefined, // forced optional
  country: DEFAULT as string | undefined, // forced optional
  countryType: DEFAULT as string | undefined, // forced optional
  email: DEFAULT as string | undefined,
  firmName: DEFAULT as string | undefined,
  firstName: DEFAULT as string | undefined,
  isSeniorJudge: DEFAULT as boolean | undefined,
  isUpdatingInformation: DEFAULT as boolean | undefined,
  judgeFullName: DEFAULT as string | undefined,
  judgePhoneNumber: DEFAULT as string | undefined,
  judgeTitle: DEFAULT as string | undefined,
  lastName: DEFAULT as string | undefined,
  name: DEFAULT as string,
  middleName: DEFAULT as string | undefined,
  originalBarState: DEFAULT as string | undefined,
  pendingEmail: DEFAULT as string | undefined,
  pendingEmailVerificationToken: DEFAULT as string | undefined,
  pendingEmailVerificationTokenTimestamp: DEFAULT as Date | undefined,
  phone: DEFAULT as string | undefined, // forced optional
  postalCode: DEFAULT as string | undefined, // forced optional
  practiceType: DEFAULT as string | undefined,
  practitionerType: DEFAULT as string | undefined,
  role: DEFAULT as string,
  section: DEFAULT as string | undefined,
  serviceIndicator: DEFAULT as string | undefined,
  state: DEFAULT as string | undefined, // forced optional
  token: DEFAULT as string | undefined,
  userId: DEFAULT as string,
  userType: DEFAULT as string | undefined, // TODO 10495 Notes: "entityName": "Practitioner",
};

export type UserTable = typeof userTableDefinition;

export const DW_USER_COLUMNS = Object.keys(userTableDefinition) as Array<
  keyof UserTable
>;

export type UserKysely = Selectable<UserTable>;
export type NewUserKysely = Insertable<UserTable>;
export type UpdateUserKysely = Updateable<UserTable>;
