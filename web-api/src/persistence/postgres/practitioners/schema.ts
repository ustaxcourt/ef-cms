import { Insertable, Selectable, Updateable } from 'kysely';

const DEFAULT = {};

export const practitionerTableDefinition = {
  additionalPhone: DEFAULT as string | null,
  address1: DEFAULT as string | null, // forced optional
  address2: DEFAULT as string | null,
  address3: DEFAULT as string | null,
  admissionsDate: DEFAULT as Date,
  admissionsStatus: DEFAULT as string,
  barNumber: DEFAULT as string,
  birthYear: DEFAULT as number,
  city: DEFAULT as string | null, // forced optional
  confirmEmail: DEFAULT as string | null,
  country: DEFAULT as string | null, // forced optional
  countryType: DEFAULT as string | null, // forced optional
  email: DEFAULT as string | null,
  firmName: DEFAULT as string | null,
  firstName: DEFAULT as string,
  lastName: DEFAULT as string,
  middleName: DEFAULT as string | null,
  name: DEFAULT as string,
  originalBarState: DEFAULT as string | null,
  phone: DEFAULT as string | null, // forced optional
  postalCode: DEFAULT as string | null, // forced optional
  practiceType: DEFAULT as string,
  practitionerId: DEFAULT as string,
  practitionerNotes: DEFAULT as string | null,
  practitionerType: DEFAULT as string,
  role: DEFAULT as string,
  section: DEFAULT as string | null,
  serviceIndicator: DEFAULT as string,
  state: DEFAULT as string | null, // forced optional
  suffix: DEFAULT as string | null,
  updatedEmail: DEFAULT as string | null,
  userId: DEFAULT as string | null, // Not all Practitioners have a corresponding User
};

export type PractitionerTable = typeof practitionerTableDefinition;

export const DW_PRACTITIONER_COLUMNS = Object.keys(
  practitionerTableDefinition,
) as Array<keyof PractitionerTable>;

export type PractitionerKysely = Selectable<PractitionerTable>;
export type NewPractitionerKysely = Insertable<PractitionerTable>;
export type UpdatePractitionerKysely = Updateable<PractitionerTable>;
