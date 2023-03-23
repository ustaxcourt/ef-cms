/* eslint-disable no-unused-vars */

/*
  The plan for this file is to slowly remove all of these manually defined types as we convert entities to typescript.
*/

type TRawPenalty = {
  name: string;
  penaltyAmount: number;
  penaltyType: string;
};

type TSectionWorkItem = {
  createdAt: string;
  docketEntry: RawDocketEntry[];
  docketNumber: string;
  docketNumberSuffix: string;
  messages: any;
  section: string;
  sentBy: string;
};

type TUserContact = {
  address1: string;
  address2: string;
  address3: string;
  city: string;
  country: string;
  countryType: string;
  phone: string;
  postalCode: string;
  state: string;
};

type TTrialSessionWorkingCopyData = {
  caseMetadata: any;
  filters: {
    basisReached: boolean;
    continued: boolean;
    definiteTrial: boolean;
    dismissed: boolean;
    motionToDismiss: boolean;
    probableSettlement: boolean;
    probableTrial: boolean;
    recall: boolean;
    rule122: boolean;
    setForTrial: boolean;
    settled: boolean;
    showAll: boolean;
    statusUnassigned: boolean;
    submittedCAV: boolean;
  };
  sessionNotes: string;
  sort: string;
  sortOrder: string;
  trialSessionId: string;
  userId: string;
};

type TCaseEntity = {
  getDocketEntryById: (options: { docketEntryId: string }) => any;
  addDocketEntry: (docketEntry: any) => unknown;
  isUserIdRepresentedByPrivatePractitioner: (id: string) => boolean;
  updateDocketEntry: (docketEntry: any) => void;
} & TCase;

type TCase = {
  associatedJudge: string;
  automaticBlocked?: string;
  automaticBlockedDate?: string;
  automaticBlockedReason?: string;
  statistics: any[];
  blocked?: boolean;
  isSealed: boolean;
  blockedDate?: string;
  blockedReason?: string;
  docketEntries?: RawDocketEntry[];
  canAllowDocumentService?: boolean;
  caseTitle?: string;
  canAllowPrintableDocketRecord?: boolean;
  caseCaption: string;
  caseNote?: string;
  caseType: string;
  closedDate?: string;
  hearings?: {
    trialSessionId: string;
  }[];
  createdAt: string;
  damages?: string;
  docketNumber: string;
  docketNumberSuffix: string;
  docketNumberWithSuffix: string;
  entityName: string;
  filingType?: string;
  hasPendingItems: boolean;
  hasVerifiedIrsNotice: boolean;
  highPriority?: boolean;
  highPriorityReason?: string;
  initialCaption: string;
  initialDocketNumberSuffix: string;
  irsNoticeDate?: string;
  isPaper: boolean;
  judgeUserId?: string;
  leadDocketNumber: string;
  litigationCosts?: string;
  mailingDate?: string;
  noticeOfAttachments: boolean;
  noticeOfTrialDate?: string;
  orderDesignatingPlaceOfTrial: boolean;
  orderForAmendedPetition: boolean;
  orderForAmendedPetitionAndFilingFee: boolean;
  orderForFilingFee: boolean;
  orderForCds: boolean;
  orderForRatification: boolean;
  orderToShowCause: boolean;
  partyType: string;
  petitionPaymentDate?: string | null;
  petitionPaymentMethod?: string;
  petitionPaymentStatus: string;
  petitionPaymentWaivedDate: string | null;
  preferredTrialCity: string;
  procedureType: string;
  qcCompleteForTrial: object;
  receivedAt: string;
  sealedDate?: string;
  sortableDocketNumber: number;
  status: string;
  trialDate?: string;
  trialLocation?: string;
  trialSessionId?: string;
  trialTime?: string;
  useSameAsPrimary?: boolean;
  petitioners: TPetitioner[];
};

type TPetitioner = {
  updatedEmail?: string;
  email?: string;
  confirmEmail?: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  contactId: string;
  contactType: string;
  countryType: string;
  entityName: string;
  isAddressSealed: boolean;
  name: string;
  phone: string;
  postalCode: string;
  sealedAndUnavailable: boolean;
  serviceIndicator: string;
  state: string;
};

type TCaseNote = {
  userId: string;
  docketNumber: string;
  notes: string;
};

type TPractitioner = {
  entityName: string;
  additionalPhone: string;
  admissionsDate: string;
  admissionsStatus: string;
  representing: string[];
  barNumber: string;
  birthYear: string;
  confirmEmail: string;
  employer: string;
  firmName: string;
  firstName: string;
  lastName: string;
  middleName: string;
  name: string;
  originalBarState: string;
  practitionerNotes: string;
  practitionerType: string;
  section: string;
  suffix: string;
  serviceIndicator: string;
  updatedEmail: string;
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

type TContact = {
  address1: string;
  address2: string;
  address3: string;
  city: string;
  confirmEmail: string;
  contactId: string;
  contactType: string;
  countryType: string;
  phone: string;
  postalCode: string;
  serviceIndicator: string;
  state: string;
  updatedEmail: string;
  email: string;
  title: string;
  name: string;
  contactPrimary: {
    name: string;
  };
  contactSecondary: {
    name: string;
  };
};

type TError = TContact;

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
