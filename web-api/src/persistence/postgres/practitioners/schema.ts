import { Insertable, Selectable, Updateable } from 'kysely';

const DEFAULT = {};

export const practitionerTableDefinition = {
  additionalPhone: DEFAULT as string | undefined,
  address1: DEFAULT as string | undefined, // forced optional
  address2: DEFAULT as string | undefined,
  address3: DEFAULT as string | undefined,
  admissionsDate: DEFAULT as Date,
  admissionsStatus: DEFAULT as string,
  barNumber: DEFAULT as string,
  birthYear: DEFAULT as number,
  city: DEFAULT as string | undefined, // forced optional
  confirmEmail: DEFAULT as string | undefined,
  country: DEFAULT as string | undefined, // forced optional
  countryType: DEFAULT as string | undefined, // forced optional
  email: DEFAULT as string | undefined,
  firmName: DEFAULT as string | undefined,
  firstName: DEFAULT as string,
  // isUpdatingInformation: DEFAULT as boolean | undefined, 10495 TODO: Do practitioners have "isUpdatingInformation"?
  lastName: DEFAULT as string,
  middleName: DEFAULT as string | undefined,
  name: DEFAULT as string,
  originalBarState: DEFAULT as string | undefined,
  phone: DEFAULT as string | undefined, // forced optional
  postalCode: DEFAULT as string | undefined, // forced optional
  practiceType: DEFAULT as string,
  practitionerId: DEFAULT as string,
  practitionerNotes: DEFAULT as string | undefined,
  practitionerType: DEFAULT as string,
  representing: DEFAULT as any,
  role: DEFAULT as string,
  section: DEFAULT as string | undefined,
  serviceIndicator: DEFAULT as string,
  state: DEFAULT as string | undefined, // forced optional
  suffix: DEFAULT as string | undefined,
  // token: DEFAULT as string | undefined, 10495 TODO: Do practitioners have a "token"?
  updatedEmail: DEFAULT as string | undefined,
  userId: DEFAULT as string | undefined, // Not all Practitioners have a corresponding User
};

export type PractitionerTable = typeof practitionerTableDefinition;

export const DW_PRACTITIONER_COLUMNS = Object.keys(
  practitionerTableDefinition,
) as Array<keyof PractitionerTable>;

export type PractitionerKysely = Selectable<PractitionerTable>;
export type NewPractitionerKysely = Insertable<PractitionerTable>;
export type UpdatePractitionerKysely = Updateable<PractitionerTable>;
