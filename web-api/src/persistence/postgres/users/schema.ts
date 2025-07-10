import { Selectable, Insertable, Updateable, ColumnType } from 'kysely';

const DEFAULT = {};

const userTableDefinition = {
  userId: DEFAULT as string,
  pendingEmailVerificationToken: DEFAULT as string | null,
  pendingEmailVerificationTokenTimestamp: DEFAULT as Date | null,
  email: DEFAULT as string | null,
  name: DEFAULT as string | null,
  pendingEmail: DEFAULT as string | null,
  role: DEFAULT as string | null,
  token: DEFAULT as string | null,
  isUpdatingInformation: DEFAULT as boolean | null,
  contact: DEFAULT as ColumnType<Record<string, any>, string, string> | null,
  judgeFullName: DEFAULT as string | null,
  judgeTitle: DEFAULT as string | null,
  section: DEFAULT as string | null,
  isSeniorJudge: DEFAULT as boolean | null,
  judgePhoneNumber: DEFAULT as string | null,
  additionalPhone: DEFAULT as string | null,
  admissionsDate: DEFAULT as Date | null,
  admissionsStatus: DEFAULT as string | null,
  barNumber: DEFAULT as string | null,
  birthYear: DEFAULT as number | null,
  confirmEmail: DEFAULT as string | null,
  practiceType: DEFAULT as string | null,
  firmName: DEFAULT as string | null,
  firstName: DEFAULT as string | null,
  lastName: DEFAULT as string | null,
  middleName: DEFAULT as string | null,
  originalBarState: DEFAULT as string | null,
  practitionerNotes: DEFAULT as string | null,
  practitionerType: DEFAULT as string | null,
  suffix: DEFAULT as string | null,
  updatedEmail: DEFAULT as string | null,
};

export type UserTable = typeof userTableDefinition;

export const DW_USER_COLUMNS = Object.keys(userTableDefinition) as Array<
  keyof UserTable
>;

export type UserKysely = Selectable<UserTable>;
export type NewUserKysely = Insertable<UserTable>;
export type UpdateUserKysely = Updateable<UserTable>;
