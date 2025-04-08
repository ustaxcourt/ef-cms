import { Selectable, Insertable, Updateable } from 'kysely';

const DEFAULT = {};

export const petitionerOnCaseTableDefinition = {
  additionalName: DEFAULT as string | undefined,
  contactType: DEFAULT as string,
  docketNumber: DEFAULT as string,
  hasConsentedToElectronicService: DEFAULT as boolean | undefined,
  hasElectronicAccess: DEFAULT as boolean | undefined,
  inCareOf: DEFAULT as string | undefined,
  isAddressSealed: DEFAULT as boolean,
  paperPetitionEmail: DEFAULT as string | undefined,
  placeOfLegalResidence: DEFAULT as string | undefined,
  sealedAndUnavailable: DEFAULT as boolean | undefined,
  secondaryName: DEFAULT as string | undefined,
  serviceIndicator: DEFAULT as string | undefined,
  title: DEFAULT as string | undefined,
  orderOnCase: DEFAULT as number,

  // Maybe break this out into a contact table down the road
  address1: DEFAULT as string,
  address2: DEFAULT as string | undefined,
  address3: DEFAULT as string | undefined,
  city: DEFAULT as string,
  contactId: DEFAULT as string,
  country: DEFAULT as string | undefined,
  countryType: DEFAULT as string,
  email: DEFAULT as string | undefined,
  name: DEFAULT as string,
  phone: DEFAULT as string,
  postalCode: DEFAULT as string,
  state: DEFAULT as string | undefined,
};

export type PetitionerOnCaseTable = typeof petitionerOnCaseTableDefinition;

export const DW_PETITIONERS_ON_CASE_COLUMNS = Object.keys(
  petitionerOnCaseTableDefinition,
) as Array<keyof PetitionerOnCaseTable>;

export type PetitionerOnCaseKysely = Selectable<PetitionerOnCaseTable>;
export type NewPetitionerOnCaseKysely = Insertable<PetitionerOnCaseTable>;
export type UpdatePetitionerOnCaseKysely = Updateable<PetitionerOnCaseTable>;
