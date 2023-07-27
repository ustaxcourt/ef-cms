const rawCaseRecord: RawCase = {
  associatedJudge: 'Buch',
  automaticBlocked: false,
  caseCaption:
    'Virginia Vincent, Deceased, Virginia Vincent, Surviving Spouse, Petitioner',
  caseType: 'Partnership (Section 6226)',
  createdAt: '2021-10-29T13:41:06.778Z',
  docketNumber: '101-11',
  docketNumberSuffix: null,
  docketNumberWithSuffix: '101-11',
  entityName: 'Case',
  hasPendingItems: false,
  hasVerifiedIrsNotice: false,
  initialCaption:
    'Virginia Vincent, Deceased, Virginia Vincent, Surviving Spouse, Petitioner',
  initialDocketNumberSuffix: '_',
  isPaper: true,
  isSealed: false,
  mailingDate: '15-Dec-1973',
  noticeOfAttachments: false,
  orderDesignatingPlaceOfTrial: false,
  orderForAmendedPetition: false,
  orderForAmendedPetitionAndFilingFee: false,
  orderForCds: false,
  orderForFilingFee: false,
  orderForRatification: true,
  orderToShowCause: false,
  partyType: 'Surviving spouse',
  petitionPaymentDate: null,
  petitionPaymentStatus: 'Not paid',
  petitionPaymentWaivedDate: null,
  petitioners: [
    {
      additionalName: 'Virginia Vincent',
      address1: '413 Clarendon Road',
      address2: 'Repudiandae tempore',
      address3: 'Nemo sunt qui error',
      city: 'Ut esse quia sit co',
      contactId: '9909b20a-c495-4438-a78c-8cf51afbbed3',
      contactType: 'petitioner',
      countryType: 'domestic',
      entityName: 'Petitioner',
      isAddressSealed: false,
      name: 'Virginia Vincent',
      phone: '+1 (477) 792-6314',
      postalCode: '69565',
      sealedAndUnavailable: false,
      serviceIndicator: 'Paper',
      state: 'NC',
    },
  ],
  pk: 'case|101-11',
  preferredTrialCity: 'Lubbock, Texas',
  procedureType: 'Regular',
  qcCompleteForTrial: {},
  receivedAt: '2011-10-11T04:00:00.000Z',
  sk: 'case|101-11',
  sortableDocketNumber: 2011000101,
  statistics: [],
  status: 'General Docket - Not at Issue',
};

const rqtDocketEntry = {
  addToCoversheet: false,
  createdAt: '2022-02-01T17:21:05.486Z',
  docketEntryId: '06115c26-ecd8-425a-b58b-4d25649f1d96',
  docketNumber: '100-22',
  documentTitle: 'Request for Place of Trial at Birmingham, Alabama',
  documentType: 'Request for Place of Trial',
  entityName: 'DocketEntry',
  eventCode: 'RQT',
  filers: [],
  filingDate: '2022-02-01T17:21:05.483Z',
  index: 2,
  isDraft: false,
  isFileAttached: false,
  isMinuteEntry: true,
  isOnDocketRecord: true,
  isStricken: false,
  pending: false,
  pk: 'case|100-22',
  processingStatus: 'complete',
  receivedAt: '2022-02-01T05:00:00.000Z',
  sk: 'docket-entry|06115c26-ecd8-425a-b58b-4d25649f1d96',
  userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
};

const submittedRawCases: RawCase[] = [];
const cavRawCases: RawCase[] = [];
const rqtRawDocketEntries = [];

const formatNumber = numberSuffix =>
  numberSuffix.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

for (let i = 0; i < 100; i++) {
  const formattedNumber = formatNumber(i);
  const docketNumber = `1${formattedNumber}-23`;
  const cavCase = {
    ...rawCaseRecord,
    docketNumber,
    docketNumberWithSuffix: docketNumber,
    pk: `case|${docketNumber}`,
    sk: `case|${docketNumber}`,
    status: 'CAV',
  };
  const docketEntry = {
    ...rqtDocketEntry,
    docketEntryId: `06115c26-ecd8-425a-b58b-4d25649f1d96${docketNumber}`,
    docketNumber,
    pk: `case|${docketNumber}`,
    sk: `docket-entry|06115c26-ecd8-425a-b58b-4d25649f1d96${docketNumber}`,
  };
  cavRawCases.push(cavCase);
  rqtRawDocketEntries.push(docketEntry);
}

for (let i = 0; i < 97; i++) {
  const formattedNumber = formatNumber(i);
  const docketNumber = `1${formattedNumber}-22`;
  const submittedCase = {
    ...rawCaseRecord,
    docketNumber,
    docketNumberWithSuffix: docketNumber,
    pk: `case|${docketNumber}`,
    sk: `case|${docketNumber}`,
    status: 'Submitted',
  };
  const docketEntry = {
    ...rqtDocketEntry,
    docketEntryId: `06115c26-ecd8-425a-b58b-4d25649f1d96${docketNumber}`,
    pk: `case|${docketNumber}`,
    sk: `docket-entry|06115c26-ecd8-425a-b58b-4d25649f1d96${docketNumber}`,
  };
  submittedRawCases.push(submittedCase);
  rqtRawDocketEntries.push(docketEntry);
}

// const judgeColvinUser = {
//   email: 'judgeColvin@example.com',
//   entityName: 'User',
//   name: 'Judge Colvin',
//   pk: 'user|dabbad00-18d0-43ec-bafb-654e83405416',
//   role: 'judge',
//   section: 'judge',
//   sk: 'user|dabbad00-18d0-43ec-bafb-654e83405416',
//   userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
// };

const judgeColvinUser = {
  email: 'judgecolvin@example.com',
  entityName: 'User',
  judgeFullName: 'John O. Colvin',
  judgeTitle: 'Judge',
  name: 'Colvin',
  pk: 'user|dabbad00-18d0-43ec-bafb-654e83405416',
  role: 'judge',
  section: 'colvinsChambers',
  sk: 'user|dabbad00-18d0-43ec-bafb-654e83405416',
  userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
};

const docketclerk = {
  email: 'docketclerk@example.com',
  entityName: 'User',
  name: 'Test Docketclerk',
  pk: 'user|1805d1ab-18d0-43ec-bafb-654e83405416',
  role: 'docketclerk',
  section: 'docket',
  sk: 'user|1805d1ab-18d0-43ec-bafb-654e83405416',
  userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
};

const petitionsClerk = {
  email: 'petitionsclerk@example.com',
  entityName: 'User',
  name: 'Test Petitionsclerk',
  pk: 'user|3805d1ab-18d0-43ec-bafb-654e83405416',
  role: 'petitionsclerk',
  section: 'petitions',
  sk: 'user|3805d1ab-18d0-43ec-bafb-654e83405416',
  userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
};

const colvinChambers = {
  email: 'colvinschambers@example.com',
  entityName: 'User',
  name: "Test Colvin's Chambers",
  pk: 'user|9c9292a4-2d5d-45b1-b67f-ac0e1c9b5df5',
  role: 'chambers',
  section: 'colvinsChambers',
  sk: 'user|9c9292a4-2d5d-45b1-b67f-ac0e1c9b5df5',
  userId: '9c9292a4-2d5d-45b1-b67f-ac0e1c9b5df5',
};

export const seedData = [
  ...submittedRawCases,
  ...cavRawCases,
  ...rqtRawDocketEntries,
  judgeColvinUser,
  docketclerk,
  petitionsClerk,
  colvinChambers,
];
