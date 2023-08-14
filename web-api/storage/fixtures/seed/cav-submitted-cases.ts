import { DOCKET_NUMBER_SUFFIXES } from '../../../../shared/src/business/entities/EntityConstants';

const rawCaseRecord: RawCase = {
  associatedJudge: 'Colvin',
  automaticBlocked: false,
  caseCaption:
    'Virginia Vincent, Deceased, Virginia Vincent, Surviving Spouse, Petitioner',

  caseType: 'Partnership (Section 6226)',
  createdAt: '2021-10-29T13:41:06.778Z',
  docketNumber: '101-11',
  docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
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
  petitionPaymentStatus: 'Not paid',
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
  receivedAt: '2011-10-11T04:00:00.000Z',
  sk: 'case|101-11',
  sortableDocketNumber: 2011000101,
  statistics: [],
  status: 'General Docket - Not at Issue',
};

const rqtDocketEntry: RawDocketEntry = {
  addToCoversheet: false,
  createdAt: '2022-02-01T17:21:05.486Z',
  docketEntryId: '06115c26-ecd8-425a-b58b-4d25649f1d96',
  docketNumber: '100-22',
  documentTitle: 'Request for Place of Trial at Birmingham, Alabama',
  documentType: 'Request for Place of Trial',
  entityName: 'DocketEntry',
  eventCode: 'RQT',
  filedByRole: 'petitioner',
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
const rqtRawDocketEntries: RawDocketEntry[] = [];

const formatNumber = numberSuffix =>
  numberSuffix.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

for (let i = 0; i < 100; i++) {
  const formattedNumber = formatNumber(i);
  const docketNumber = `4${formattedNumber}-23`;
  const sortableDocketNumber = Number(`20230001${formattedNumber}`);
  const caseStatusHistory = [
    {
      changedBy: 'Docketclerk',
      date: '2022-12-21T19:03:01.908Z',
      updatedCaseStatus: 'CAV',
    },
  ];
  const cavCase = {
    ...rawCaseRecord,
    caseStatusHistory,
    docketNumber,
    docketNumberWithSuffix: docketNumber,
    pk: `case|${docketNumber}`,
    sk: `case|${docketNumber}`,
    sortableDocketNumber,
    status: 'CAV',
  };
  const docketEntry = {
    ...rqtDocketEntry,
    docketEntryId: `06115c26-ecd8-425a-b58b-4d25649f1d${formattedNumber}`,
    docketNumber,
    pk: `case|${docketNumber}`,
    sk: `docket-entry|06115c26-ecd8-425a-b58b-4d25649f1d${formattedNumber}`,
  };
  cavRawCases.push(cavCase);
  rqtRawDocketEntries.push(docketEntry);
}

for (let i = 0; i < 97; i++) {
  const formattedNumber = formatNumber(i);
  const docketNumber = `4${formattedNumber}-22`;
  const sortableDocketNumber = Number(`20220001${formattedNumber}`);
  const caseStatusHistory = [
    {
      changedBy: 'Docketclerk',
      date: '2022-12-21T19:03:01.908Z',
      updatedCaseStatus: 'Submitted',
    },
  ];
  const submittedCase = {
    ...rawCaseRecord,
    caseStatusHistory,
    docketNumber,
    docketNumberWithSuffix: docketNumber,
    pk: `case|${docketNumber}`,
    sk: `case|${docketNumber}`,
    sortableDocketNumber,
    status: 'Submitted',
  };
  const docketEntry = {
    ...rqtDocketEntry,
    docketEntryId: `06115c26-ecd8-425a-b58b-4d25649f1d${formattedNumber}`,
    pk: `case|${docketNumber}`,
    sk: `docket-entry|06115c26-ecd8-425a-b58b-4d25649f1d${formattedNumber}`,
  };
  submittedRawCases.push(submittedCase);
  rqtRawDocketEntries.push(docketEntry);
}

export const seedData: (RawCase | RawDocketEntry)[] = [
  ...submittedRawCases,
  ...cavRawCases,
  ...rqtRawDocketEntries,
];
