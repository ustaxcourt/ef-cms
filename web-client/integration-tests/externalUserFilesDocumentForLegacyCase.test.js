import { MOCK_CASE } from '../../shared/src/test/mockCase.js';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { associatedExternalUserViewsCaseDetailForOwnedCase } from './journey/associatedExternalUserViewsCaseDetailForOwnedCase.js';
import { externalUserFilesDocumentForOwnedCase } from './journey/externalUserFilesDocumentForOwnedCase.js';
import {
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
} from './helpers';
import axios from 'axios';

const test = setupTest();

const axiosInstance = axios.create({
  headers: {
    Authorization:
      // mocked admin user
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluIiwibmFtZSI6IlRlc3QgQWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJ1c2VySWQiOiI4NmMzZjg3Yi0zNTBiLTQ3N2QtOTJjMy00M2JkMDk1Y2IwMDYiLCJjdXN0b206cm9sZSI6ImFkbWluIiwic3ViIjoiODZjM2Y4N2ItMzUwYi00NzdkLTkyYzMtNDNiZDA5NWNiMDA2IiwiaWF0IjoxNTgyOTIxMTI1fQ.PBmSyb6_E_53FNG0GiEpAFqTNmooSh4rI0ApUQt3UH8',
    'Content-Type': 'application/json',
  },
  timeout: 2000,
});

const {
  CHIEF_JUDGE,
  COUNTRY_TYPES,
  INITIAL_DOCUMENT_TYPES,
  SERVICE_INDICATOR_TYPES,
  STATUS_TYPES,
} = applicationContext.getConstants();

const caseWithEAccess = {
  ...MOCK_CASE,
  associatedJudge: CHIEF_JUDGE,
  caseCaption: 'The Sixth Migrated Case',
  contactPrimary: {
    ...MOCK_CASE.contactPrimary,
    email: 'petitioner@example.com',
    hasEAccess: true,
  },
  docketEntries: [
    {
      createdAt: '2018-11-21T20:49:28.192Z',
      docketEntryId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      docketNumber: '101-18',
      documentTitle: 'Petition',
      documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
      eventCode: INITIAL_DOCUMENT_TYPES.petition.eventCode,
      filedBy: 'Test Petitioner',
      filingDate: '2018-03-01T00:01:00.000Z',
      index: 1,
      isFileAttached: true,
      isLegacy: true,
      isLegacyServed: true,
      isOnDocketRecord: true,
      processingStatus: 'complete',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    },
  ],
  docketNumber: '999-15',
  irsPractitioners: [
    {
      barNumber: 'RT6789',
      contact: {
        address1: '982 Oak Boulevard',
        address2: 'Maxime dolorum quae ',
        address3: 'Ut numquam ducimus ',
        city: 'Placeat sed dolorum',
        countryType: COUNTRY_TYPES.DOMESTIC,
        phone: '+1 (785) 771-2329',
        postalCode: '17860',
        state: 'LA',
      },
      email: 'someone@example.com',
      hasEAccess: true,
      name: 'Keelie Bruce',
      role: 'irsPractitioner',
      secondaryName: 'Logan Fields',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
    },
  ],
  preferredTrialCity: 'Washington, District of Columbia',
  privatePractitioners: [
    {
      barNumber: 'PT1234',
      contact: {
        address1: '982 Oak Boulevard',
        address2: 'Maxime dolorum quae ',
        address3: 'Ut numquam ducimus ',
        barNumber: 'PT1234',
        city: 'Placeat sed dolorum',
        countryType: COUNTRY_TYPES.DOMESTIC,
        phone: '+1 (785) 771-2329',
        postalCode: '17860',
        state: 'LA',
      },
      email: 'someone@example.com',
      hasEAccess: true,
      name: 'Keelie Bruce',
      representing: ['7805d1ab-18d0-43ec-bafb-654e83405416'],
      role: 'privatePractitioner',
      secondaryName: 'Logan Fields',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      userId: 'd2161b1e-7b85-4f33-b1cc-ff11bca2f819',
    },
  ],
  status: STATUS_TYPES.calendared,
  trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
};

describe('external user files a document for their legacy case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  it('should migrate case', async () => {
    await axiosInstance.post(
      'http://localhost:4000/migrate/case',
      caseWithEAccess,
    );

    await refreshElasticsearchIndex();
    test.docketNumber = caseWithEAccess.docketNumber;
  });

  loginAs(test, 'petitioner@example.com');
  associatedExternalUserViewsCaseDetailForOwnedCase(test);
  externalUserFilesDocumentForOwnedCase(test, fakeFile);

  loginAs(test, 'privatePractitioner@example.com');
  associatedExternalUserViewsCaseDetailForOwnedCase(test);
  externalUserFilesDocumentForOwnedCase(test, fakeFile);

  loginAs(test, 'irsPractitioner@example.com');
  associatedExternalUserViewsCaseDetailForOwnedCase(test);
  externalUserFilesDocumentForOwnedCase(test, fakeFile);
});
