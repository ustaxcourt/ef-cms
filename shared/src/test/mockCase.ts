import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  SERVICE_INDICATOR_TYPES,
} from '../business/entities/EntityConstants';
import { MOCK_DOCUMENTS } from './mockDocketEntry';
import { docketClerkUser, judgeUser } from './mockUsers';

export const MOCK_CASE: RawCase = {
  archivedDocketEntries: [],
  caseCaption: 'Test Petitioner, Petitioner',
  caseType: CASE_TYPES_MAP.other,
  correspondence: [],
  createdAt: '2018-03-01T21:40:46.415Z',
  docketEntries: MOCK_DOCUMENTS,
  docketNumber: '101-18',
  docketNumberWithSuffix: '101-18',
  entityName: 'Case',
  filingType: 'Myself',
  hasVerifiedIrsNotice: false,
  hearings: [],
  irsNoticeDate: '2018-03-01T00:00:00.000Z',
  irsPractitioners: [],
  partyType: PARTY_TYPES.petitioner,
  petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
  petitioners: [
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      contactType: CONTACT_TYPES.primary,
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      entityName: 'Petitioner',
      isAddressSealed: false,
      name: 'Test Petitioner',
      phone: '1234567',
      postalCode: '12345',
      sealedAndUnavailable: false,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      state: 'TN',
      title: 'Executor',
    },
  ],
  preferredTrialCity: 'Washington, District of Columbia',
  privatePractitioners: [],
  procedureType: 'Regular',
  receivedAt: '2018-03-01T21:40:46.415Z',
  sortableDocketNumber: 2018000101,
  status: CASE_STATUS_TYPES.new,
};

const mockDocketEntriesWithoutStipDecision = MOCK_DOCUMENTS.slice(0, 3);

export const MOCK_CASE_WITHOUT_PENDING = {
  caseCaption: 'Test Petitioner, Petitioner',
  caseType: CASE_TYPES_MAP.other,
  docketEntries: mockDocketEntriesWithoutStipDecision,
  docketNumber: '101-18',
  entityName: 'Case',
  filingType: 'Myself',
  irsNoticeDate: '2018-03-01T00:00:00.000Z',
  partyType: PARTY_TYPES.petitioner,
  petitioners: [
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      contactType: 'primary',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      name: 'Test Petitioner',
      phone: '1234567',
      postalCode: '12345',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      state: 'TN',
      title: 'Executor',
    },
  ],
  preferredTrialCity: 'Washington, District of Columbia',
  procedureType: 'Regular',
  status: CASE_STATUS_TYPES.new,
};

export const MOCK_CASE_WITHOUT_NOTICE = {
  docketEntries: MOCK_DOCUMENTS,
  docketNumber: '101-18',
  entityName: 'Case',
  filingType: 'Myself',
  partyType: PARTY_TYPES.petitioner,
  petitioners: [
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactType: 'primary',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      name: 'Test Petitioner',
      phone: '1234567',
      postalCode: '12345',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      state: 'TN',
      title: 'Executor',
    },
  ],
  preferredTrialCity: 'Washington, District of Columbia',
  procedureType: 'Regular',
  status: CASE_STATUS_TYPES.new,
};

export const MOCK_CASE_WITH_SECONDARY_OTHERS = {
  caseCaption: 'Test Petitioner, Test Petitioner 2, Petitioner',
  caseType: CASE_TYPES_MAP.other,
  docketEntries: MOCK_DOCUMENTS,
  docketNumber: '109-19',
  entityName: 'Case',
  filingType: 'Myself',
  partyType: PARTY_TYPES.petitionerDeceasedSpouse,
  petitioners: [
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      contactType: CONTACT_TYPES.petitioner,
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      name: 'Test Petitioner',
      phone: '1234567',
      postalCode: '12345',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      state: 'TN',
      title: 'Executor',
    },
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '3336050f-a423-47bb-943b-a5661fe08a6b',
      contactType: CONTACT_TYPES.participant,
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      inCareOf: 'Myself',
      name: 'Test Petitioner3',
      phone: '1234567',
      postalCode: '12345',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      state: 'TN',
      title: 'Tax Matters Partner',
    },
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '4446050f-a423-47bb-943b-a5661fe08a6b',
      contactType: CONTACT_TYPES.participant,
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      inCareOf: 'Myself',
      name: 'Test Petitioner4',
      phone: '1234567',
      postalCode: '12345',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      state: 'TN',
      title: 'Tax Matters Partner',
    },
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '3336050f-a423-47bb-943b-a5661fe08a6b',
      contactType: CONTACT_TYPES.participant,
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      inCareOf: 'Myself',
      name: 'Test Petitioner3',
      phone: '1234567',
      postalCode: '12345',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      state: 'TN',
      title: 'Tax Matters Partner',
    },
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '4446050f-a423-47bb-943b-a5661fe08a6b',
      contactType: CONTACT_TYPES.participant,
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      inCareOf: 'Myself',
      name: 'Test Petitioner4',
      phone: '1234567',
      postalCode: '12345',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      state: 'TN',
      title: 'Tax Matters Partner',
    },
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '2226050f-a423-47bb-943b-a5661fe08a6b',
      contactType: CONTACT_TYPES.petitioner,
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      inCareOf: 'Myself',
      name: 'Test Petitioner2',
      phone: '1234567',
      postalCode: '12345',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      state: 'TN',
      title: 'Executor',
    },
  ],
  preferredTrialCity: 'Washington, District of Columbia',
  procedureType: 'Regular',
  status: CASE_STATUS_TYPES.generalDocket,
};

export const MOCK_LEAD_CASE_WITH_PAPER_SERVICE = {
  caseCaption: 'Test Petitioner, Test Petitioner 2',
  caseType: CASE_TYPES_MAP.other,
  docketEntries: MOCK_DOCUMENTS,
  docketNumber: '109-19',
  entityName: 'Case',
  filingType: 'Myself',
  irsPractitioners: [],
  leadDocketNumber: '109-19',
  partyType: PARTY_TYPES.petitionerDeceasedSpouse,
  petitioners: [
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      contactType: CONTACT_TYPES.petitioner,
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      name: 'Test Petitioner',
      phone: '1234567',
      postalCode: '12345',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      state: 'TN',
      title: 'Executor',
    },
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '3336050f-a423-47bb-943b-a5661fe08a6b',
      contactType: CONTACT_TYPES.participant,
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      inCareOf: 'Myself',
      name: 'Test Petitioner3',
      phone: '1234567',
      postalCode: '12345',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      state: 'TN',
      title: 'Tax Matters Partner',
    },
  ],
  preferredTrialCity: 'Washington, District of Columbia',
  privatePractitioners: [],
  procedureType: 'Regular',
  status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
};

export const MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE = {
  caseCaption: 'Test Petitioner, Test Petitioner 2',
  caseType: CASE_TYPES_MAP.other,
  docketEntries: MOCK_DOCUMENTS,
  docketNumber: '110-19',
  entityName: 'Case',
  filingType: 'Myself',
  leadDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
  partyType: PARTY_TYPES.petitionerDeceasedSpouse,
  petitioners: [
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      contactType: CONTACT_TYPES.petitioner,
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      name: 'Test Petitioner',
      phone: '1234567',
      postalCode: '12345',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      state: 'TN',
      title: 'Executor',
    },
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '3336050f-a423-47bb-943b-a5661fe08a6b',
      contactType: CONTACT_TYPES.participant,
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      inCareOf: 'Myself',
      name: 'Test Petitioner3',
      phone: '1234567',
      postalCode: '12345',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      state: 'TN',
      title: 'Tax Matters Partner',
    },
  ],
  preferredTrialCity: 'Washington, District of Columbia',
  procedureType: 'Regular',
  status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
};

export const MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE = {
  caseCaption: 'Test Petitioner, Test Petitioner 2',
  caseType: CASE_TYPES_MAP.other,
  docketEntries: MOCK_DOCUMENTS,
  docketNumber: '111-19',
  entityName: 'Case',
  filingType: 'Myself',
  leadDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
  partyType: PARTY_TYPES.petitionerDeceasedSpouse,
  petitioners: [
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      contactType: CONTACT_TYPES.petitioner,
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      name: 'Test Petitioner',
      phone: '1234567',
      postalCode: '12345',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      state: 'TN',
      title: 'Executor',
    },
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '3336050f-a423-47bb-943b-a5661fe08a6b',
      contactType: CONTACT_TYPES.participant,
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      inCareOf: 'Myself',
      name: 'Test Petitioner3',
      phone: '1234567',
      postalCode: '12345',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      state: 'TN',
      title: 'Tax Matters Partner',
    },
  ],
  preferredTrialCity: 'Washington, District of Columbia',
  procedureType: 'Regular',
  status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
};

export const MOCK_CASE_WITH_TRIAL_SESSION = {
  archivedDocketEntries: [],
  associatedJudge: 'Judge Fieri',
  caseCaption: 'Test Petitioner, Petitioner',
  caseType: CASE_TYPES_MAP.other,
  correspondence: [],
  createdAt: '2018-03-01T21:40:46.415Z',
  docketEntries: MOCK_DOCUMENTS,
  docketNumber: '101-18',
  docketNumberWithSuffix: '101-18',
  entityName: 'Case',
  filingType: 'Myself',
  irsNoticeDate: '2018-03-01T00:00:00.000Z',
  partyType: PARTY_TYPES.petitioner,
  petitioners: [
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      contactType: CONTACT_TYPES.petitioner,
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      name: 'Test Petitioner',
      phone: '1234567',
      postalCode: '12345',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      state: 'TN',
      title: 'Executor',
    },
  ],
  preferredTrialCity: 'Washington, District of Columbia',
  procedureType: 'Regular',
  status: CASE_STATUS_TYPES.calendared,
  trialDate: '2020-03-01T00:00:00.000Z',
  trialLocation: 'Washington, District of Columbia',
  trialSessionId: '7805d1ab-18d0-43ec-bafb-654e83405410',
  trialTime: '10:00',
};

export const MOCK_ELIGIBLE_CASE = {
  caseCaption: 'Guy Fieri & Gordon Ramsay, Petitioner',
  caseType: CASE_TYPES_MAP.other,
  docketNumber: '321-21',
  docketNumberSuffix: 'W',
  highPriority: true,
  irsPractitioners: [],
  privatePractitioners: [],
};

export const MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS = {
  caseCaption: 'Guy Fieri & Gordon Ramsay, Petitioner',
  caseType: CASE_TYPES_MAP.other,
  docketNumber: '321-21',
  docketNumberSuffix: 'W',
  highPriority: true,
  irsPractitioners: [
    {
      barNumber: 'VS0062',
      contact: {
        address1: '016 Miller Loop Apt. 494',
        address2: 'Apt. 835',
        address3: null,
        city: 'Cristianville',
        country: 'U.S.A.',
        countryType: 'domestic',
        phone: '001-016-669-6532x5946',
        postalCode: '68117',
        state: 'NE',
      },
      email: 'adam22@example.com',
      entityName: 'IrsPractitioner',
      name: 'Isaac Benson',
      role: 'irsPractitioner',
      serviceIndicator: 'Electronic',
      userId: '020374b7-b274-462b-8a16-65783147efa9',
    },
  ],
  privatePractitioners: [
    {
      barNumber: 'OK0063',
      contact: {
        address1: '5943 Joseph Summit',
        address2: 'Suite 334',
        address3: null,
        city: 'Millermouth',
        country: 'U.S.A.',
        countryType: 'domestic',
        phone: '348-858-8312',
        postalCode: '99517',
        state: 'AK',
      },
      email: 'thomastorres@example.com',
      entityName: 'PrivatePractitioner',
      name: 'Brandon Choi',
      role: 'privatePractitioner',
      serviceIndicator: 'Electronic',
      userId: '3bcd5fb7-434e-4354-aa08-1d10846c1867',
    },
  ],
};

export const MOCK_SUBMITTED_CASE_WITH_DEC_ON_DOCKET_RECORD = {
  ...MOCK_CASE,
  associatedJudge: judgeUser.name,
  caseStatusHistory: [
    {
      changedBy: docketClerkUser.name,
      date: '2023-05-12T14:19:28.717Z',
      updatedCaseStatus: CASE_STATUS_TYPES.submitted,
    },
  ],
  docketEntries: [
    {
      createdAt: '2018-11-21T20:49:28.192Z',
      docketEntryId: 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3888',
      docketNumber: '101-19',
      documentTitle: 'Decision',
      documentType: 'Decision',
      draftOrderState: {},
      entityName: 'DocketEntry',
      eventCode: 'DEC',
      isFileAttached: true,
      isMinuteEntry: false,
      isOnDocketRecord: false,
      isStricken: false,
      judge: 'Colvin',
      pending: false,
      processingStatus: 'complete',
      receivedAt: '2018-03-01T05:00:00.000Z',
      servedAt: '2019-05-24T18:41:36.122Z',
      signedAt: '2019-05-24T18:41:36.122Z',
      signedByUserId: 'dabbad00-18d0-43ec-bafb-654e83405416',
      signedJudgeName: 'John O. Colvin',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    },
  ],
  docketNumber: '121-19',
  docketNumberWithSuffix: '121-19',
  pk: 'case|121-19',
  sk: 'case|121-19',
  sortableDocketNumber: 2019000121,
};

export const MOCK_SUBMITTED_CASE_WITH_SDEC_ON_DOCKET_RECORD = {
  ...MOCK_CASE,
  associatedJudge: judgeUser.name,
  caseStatusHistory: [
    {
      changedBy: docketClerkUser.name,
      date: '2023-05-12T14:19:28.717Z',
      updatedCaseStatus: CASE_STATUS_TYPES.submitted,
    },
  ],
  docketEntries: [
    {
      createdAt: '2018-11-21T20:49:28.192Z',
      docketEntryId: 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3888',
      docketNumber: '101-19',
      documentTitle: 'Stipulated Decision Entered, [Judge Name] [Anything]',
      documentType: 'Stipulated Decision',
      draftOrderState: {},
      entityName: 'DocketEntry',
      eventCode: 'SDEC',
      filingDate: '2018-03-01T05:00:00.000Z',
      index: 4,
      isDraft: false,
      isStricken: false,
      judge: 'Colvin',
      pending: false,
      processingStatus: 'complete',
      receivedAt: '2018-03-01T05:00:00.000Z',
      servedAt: '2019-05-24T18:41:36.122Z',
      signedAt: '2019-05-24T18:41:36.122Z',
      signedByUserId: 'dabbad00-18d0-43ec-bafb-654e83405416',
      signedJudgeName: 'John O. Colvin',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    },
  ],
  docketNumber: '122-19',
  docketNumberWithSuffix: '122-19',
  pk: 'case|122-19',
  sk: 'case|122-19',
  sortableDocketNumber: 2019000122,
};

export const MOCK_SUBMITTED_CASE_WITH_ODD_ON_DOCKET_RECORD = {
  ...MOCK_CASE,
  associatedJudge: judgeUser.name,
  caseStatusHistory: [
    {
      changedBy: docketClerkUser.name,
      date: '2023-05-12T14:19:28.717Z',
      updatedCaseStatus: CASE_STATUS_TYPES.submitted,
    },
  ],
  docketEntries: [
    {
      createdAt: '2018-11-21T20:49:28.192Z',
      docketEntryId: 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3888',
      docketNumber: '101-19',
      documentTitle: `Order of Dismissal and Decision Entered, ${judgeUser.name} Dismissed`,
      documentType: 'Order of Dismissal and Decision',
      draftOrderState: {},
      entityName: 'DocketEntry',
      eventCode: 'ODD',
      filers: [],
      filingDate: '2018-03-01T05:00:00.000Z',
      index: 4,
      isDraft: false,
      isStricken: false,
      judge: 'Colvin',
      pending: false,
      processingStatus: 'complete',
      receivedAt: '2018-03-01T05:00:00.000Z',
      servedAt: '2019-05-24T18:41:36.122Z',
      signedAt: '2019-05-24T18:41:36.122Z',
      signedByUserId: 'dabbad00-18d0-43ec-bafb-654e83405416',
      signedJudgeName: 'John O. Colvin',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    },
  ],
  docketNumber: '101-19',
  docketNumberWithSuffix: '101-19',
  hasVerifiedIrsNotice: false,
  pk: 'case|101-19',
  sk: 'case|101-19',
  sortableDocketNumber: 2019000101,
  status: CASE_STATUS_TYPES.submitted,
};

export const MOCK_SUBMITTED_CASE_OAD_ON_DOCKET_RECORD = {
  ...MOCK_CASE,
  associatedJudge: judgeUser.name,
  caseStatusHistory: [
    {
      changedBy: docketClerkUser.name,
      date: '2023-05-12T14:19:28.717Z',
      updatedCaseStatus: CASE_STATUS_TYPES.submitted,
    },
  ],
  docketEntries: [
    {
      createdAt: '2018-11-21T20:49:28.192Z',
      docketEntryId: 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3888',
      docketNumber: '101-19',
      documentTitle: 'Order and Decision',
      documentType: 'Order and Decision',
      draftOrderState: {},
      entityName: 'DocketEntry',
      eventCode: 'OAD',
      filers: [],
      filingDate: '2018-03-01T05:00:00.000Z',
      index: 4,
      isDraft: false,
      isFileAttached: true,
      isMinuteEntry: false,
      isOnDocketRecord: false,
      isStricken: false,
      judge: 'Colvin',
      pending: false,
      processingStatus: 'complete',
      receivedAt: '2018-03-01T05:00:00.000Z',
      servedAt: '2019-05-24T18:41:36.122Z',
      servedParties: [
        {
          name: 'Bernard Lowe',
        },
        {
          name: 'IRS',
          role: 'irsSuperuser',
        },
      ],
      signedAt: '2019-05-24T18:41:36.122Z',
      signedByUserId: 'dabbad00-18d0-43ec-bafb-654e83405416',
      signedJudgeName: 'John O. Colvin',
      stampData: {},
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    },
  ],
  docketNumber: '123-19',
  docketNumberWithSuffix: '123-19',
  pk: 'case|123-19',
  sk: 'case|123-19',
  sortableDocketNumber: 2021000123,
};

export const MOCK_SUBMITTED_CASE: RawCase = {
  ...MOCK_CASE,
  associatedJudge: judgeUser.name,
  caseStatusHistory: [
    {
      changedBy: docketClerkUser.name,
      date: '2023-05-11T14:19:28.717Z',
      updatedCaseStatus: CASE_STATUS_TYPES.submitted,
    },
  ],
  pk: `case|${MOCK_CASE.docketNumber}`,
  sk: `case|${MOCK_CASE.docketNumber}`,
};

export const MOCK_SUBMITTED_CASE_WITHOUT_CASE_HISTORY = {
  ...MOCK_CASE,
  associatedJudge: judgeUser.name,
  caseStatusHistory: [],
  pk: 'case|115-23',
  sk: 'case|115-23',
};

export const MOCK_CAV_LEAD_CASE = {
  ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
  associatedJudge: judgeUser.name,
  caseStatusHistory: [
    {
      changedBy: docketClerkUser.name,
      date: '2023-05-13T14:19:28.717Z',
      updatedCaseStatus: CASE_STATUS_TYPES.cav,
    },
  ],
  pk: `case|${MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber}`,
  sk: `case|${MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber}`,
  sortableDocketNumber: 2019000109,
  status: CASE_STATUS_TYPES.cav,
};
