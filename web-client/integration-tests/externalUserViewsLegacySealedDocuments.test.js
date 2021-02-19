import { MOCK_CASE } from '../../shared/src/test/mockCase.js';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { associatedUserViewsCaseDetailForCaseWithLegacySealedDocument } from './journey/associatedUserViewsCaseDetailForCaseWithLegacySealedDocument';
import { loginAs, setupTest } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase.js';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase.js';
import { unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument } from './journey/unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument';
import axios from 'axios';
import faker from 'faker';

describe('External user views legacy sealed documents', () => {
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

  const { CHIEF_JUDGE, STATUS_TYPES } = applicationContext.getConstants();

  let caseWithEAccess;

  beforeAll(() => {
    console.error = () => {};
    jest.setTimeout(30000);
    const seed = faker.random.number();
    faker.seed(seed);

    const docketNumberYear = faker.random.number({ max: 99, min: 80 });
    const docketNumberPrefix = faker.random.number({ max: 99999, min: 0 });

    test.docketNumber = `${docketNumberPrefix}-${docketNumberYear}`;
    test.docketEntryId = 'b868a8d3-6990-4b6b-9ccd-b04b22f075a0';

    caseWithEAccess = {
      ...MOCK_CASE,
      associatedJudge: CHIEF_JUDGE,
      caseCaption: 'The Sixth Migrated Case',
      contactPrimary: {
        ...MOCK_CASE.contactPrimary,
        email: 'petitioner@example.com',
        hasEAccess: true,
      },
      contactSecondary: {
        ...MOCK_CASE.contactPrimary,
        contactId: '7805d1ab-18d0-43ec-bafb-654e83405417',
        email: 'petitioner2@example.com',
        hasEAccess: true,
      },
      docketEntries: [
        ...MOCK_CASE.docketEntries,
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          description: 'Answer',
          docketEntryId: test.docketEntryId,
          docketNumber: test.docketNumber,
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filingDate: '2018-11-21T20:49:28.192Z',
          index: 4,
          isFileAttached: true,
          isLegacy: true,
          isLegacySealed: true,
          isOnDocketRecord: true,
          isSealed: true,
          pending: true,
          processingStatus: 'complete',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      docketNumber: test.docketNumber,
      partyType: 'Petitioner & spouse',
      preferredTrialCity: 'Washington, District of Columbia',
      status: STATUS_TYPES.new,
    };
  });

  afterAll(() => {
    test.closeSocket();
  });

  it('should migrate a case with a isLegacySealed docket entry', async () => {
    await axiosInstance.post(
      'http://localhost:4000/migrate/case',
      caseWithEAccess,
    );
  });

  loginAs(test, 'petitioner2@example.com');
  associatedUserViewsCaseDetailForCaseWithLegacySealedDocument(test);

  loginAs(test, 'petitioner3@example.com');
  unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument(test);

  loginAs(test, 'irsPractitioner@example.com');
  unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument(test);

  loginAs(test, 'privatePractitioner@example.com');
  unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument(test);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(test, true);
  petitionsClerkAddsRespondentsToCase(test, true);

  loginAs(test, 'petitioner@example.com');
  associatedUserViewsCaseDetailForCaseWithLegacySealedDocument(test);

  loginAs(test, 'irsPractitioner@example.com');
  associatedUserViewsCaseDetailForCaseWithLegacySealedDocument(test);

  loginAs(test, 'privatePractitioner@example.com');
  associatedUserViewsCaseDetailForCaseWithLegacySealedDocument(test);
});
