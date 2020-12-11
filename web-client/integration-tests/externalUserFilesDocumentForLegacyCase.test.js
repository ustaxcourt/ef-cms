import { MOCK_CASE } from '../../shared/src/test/mockCase.js';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../src/presenter/computeds/caseDetailHeaderHelper';
import { caseDetailHelper as caseDetailHelperComputed } from '../src/presenter/computeds/caseDetailHelper';
import {
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
} from './helpers';
import { petitionerFilesADocumentForCase } from './journey/petitionerFilesADocumentForCase.js';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';
import axios from 'axios';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);
const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderHelperComputed,
);

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
  INITIAL_DOCUMENT_TYPES,
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
  preferredTrialCity: 'Washington, District of Columbia',
  status: STATUS_TYPES.calendared,
  trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
};

describe('external user files a document for their legacy case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
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

  it('user with e-access should be able to file a document in their case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);

    const helper = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    expect(helper.showPetitionProcessingAlert).toBeFalsy();

    const headerHelper = runCompute(caseDetailHeaderHelper, {
      state: test.getState(),
    });
    expect(headerHelper.showExternalButtons).toBeTruthy();
  });

  petitionerFilesADocumentForCase(test, fakeFile);
  it('petitioner verifies the document was added to the docket record', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('caseDetail.docketEntries').length).toEqual(2);
  });
});
