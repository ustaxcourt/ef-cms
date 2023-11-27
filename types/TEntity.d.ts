import { RawUser } from '@shared/business/entities/User';

/*
  The plan for this file is to slowly remove all of these manually defined types as we convert entities to typescript.
*/

type TPetitioner = {
  updatedEmail?: string;
  email?: string;
  confirmEmail?: string;
  address1: string;
  address2?: string;
  address3?: string;
  city: string;
  contactId: string;
  contactType: string;
  countryType: string;
  entityName: string;
  isAddressSealed: boolean;
  name: string;
  paperPetitionEmail?: string;
  phone: string;
  postalCode: string;
  sealedAndUnavailable: boolean;
  serviceIndicator?: string;
  state: string;
  title?: string;
};

type TCaseNote = {
  userId: string;
  docketNumber: string;
  notes: string;
};

type TPractitioner = {
  entityName: string;
  additionalPhone?: string;
  admissionsDate: string;
  admissionsStatus: string;
  representing?: string[];
  barNumber: string;
  birthYear: string;
  confirmEmail?: string;
  employer: string;
  firmName: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  name: string;
  originalBarState: string;
  practitionerNotes?: string;
  practitionerType: string;
  section: string;
  suffix?: string;
  serviceIndicator: string;
  updatedEmail?: string;
  role: string;
} & RawUser;

interface IValidateRawCollection<I> {
  (collection: I[], options: { applicationContext: IApplicationContext }): I[];
}

type TCorrespondence = {
  correspondenceId: string;
};

type TDocumentMetaData = {
  docketNumber: string;
  documentTitle: string;
  filingDate: string;
  correspondenceId: string;
};

type TPrintableTableFilters = {
  aBasisReached: boolean;
  continued: boolean;
  dismissed: boolean;
  recall: boolean;
  rule122: boolean;
  setForTrial: boolean;
  settled: boolean;
  showAll: boolean;
  statusUnassigned: boolean;
  takenUnderAdvisement: boolean;
};

type SubType<Base, Condition> = Pick<
  Base,
  {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
  }[keyof Base]
>;

type KeyOfType<Base, Types> = {
  [Key in keyof Base]: Base[Key] extends Types ? Key : never;
}[keyof Base];

type ExcludeMethods<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]
>;
