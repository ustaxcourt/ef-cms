import { MOCK_CASE } from '../../shared/src/test/mockCase.js';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { associatedUserAdvancedSearchForSealedCase } from './journey/associatedUserAdvancedSearchForSealedCase';
import { associatedUserViewsCaseDetailForSealedCase } from './journey/associatedUserViewsCaseDetailForSealedCase';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { externalUserSearchesForAnOrderOnSealedCase } from './journey/externalUserSearchesForAnOrderOnSealedCase';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { runCompute } from 'cerebral/test';
import { unassociatedUserAdvancedSearchForSealedCase } from './journey/unassociatedUserAdvancedSearchForSealedCase';
import { unassociatedUserViewsCaseDetailForSealedCase } from './journey/unassociatedUserViewsCaseDetailForSealedCase';
import { withAppContextDecorator } from '../src/withAppContext';
import axios from 'axios';

describe('External user views legacy sealed documents', () => {
  const test = setupTest();

  const formattedCaseDetail = withAppContextDecorator(
    formattedCaseDetailComputed,
  );

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
    STATUS_TYPES,
  } = applicationContext.getConstants();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  // migrate a case with isLegacySealed: true on a docket entry
  const legacySealedDocketEntryId = 'b868a8d3-6990-4b6b-9ccd-b04b22f075a0';
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
      ...MOCK_CASE.docketEntries,
      {
        createdAt: '2018-11-21T20:49:28.192Z',
        description: 'Answer',
        docketEntryId: legacySealedDocketEntryId,
        docketNumber: '101-21',
        documentTitle: 'Answer',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        filingDate: '2018-11-21T20:49:28.192Z',
        index: 4,
        // isLegacy: true,
        // isLegacySealed: true,
        // isOnDocketRecord: true,
        // isSealed: true,
        pending: true,
        processingStatus: 'complete',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ],
    docketNumber: '333-15',
    preferredTrialCity: 'Washington, District of Columbia',
    status: STATUS_TYPES.calendared,
    trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
  };

  it('should migrate a case with a isLegacySealed docket entry', async () => {
    await axiosInstance.post(
      'http://localhost:4000/migrate/case',
      caseWithEAccess,
    );
  });

  // login as an unassociated petitioner
  loginAs(test, 'petitioner2@example.com');

  it('should verify the isLegacySealed docket entry is not linked and the pdf URL throws an error when loaded', async () => {
    // view the case
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: caseWithEAccess.docketNumber,
    });

    // check for no link on the docket record
    const formattedCase = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });
    const legacySealedDocketEntry = formattedCase.formattedPendingDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === legacySealedDocketEntryId,
    );
    expect(legacySealedDocketEntry.showLinkToDocument).toBeFalsy();

    // try and get documentDownloadUrl, should throw an error
    await expect(
      test.runSequence('openCaseDocumentDownloadUrlSequence', {
        docketEntryId: legacySealedDocketEntryId,
        docketNumber: caseWithEAccess.docketNumber,
        isPublic: false,
      }),
    ).rejects.toThrow('Unauthorized to access private document');
  });

  // login as an unassociated respondent
  // view the case
  // check for no link on the docket record
  // try and get documentDownloadUrl, should throw an error

  // login as an unassociated practitioner
  // view the case
  // check for no link on the docket record
  // try and get documentDownloadUrl, should throw an error
  // add a practitioner to the case

  // login as docketclerk
  // associate practitioner and respondent

  // login as an associated petitioner
  // view the case
  // check for no link on the docket record
  // try and get documentDownloadUrl, should throw an error

  // login as an associated practitioner
  // view the case
  // check for no link on the docket record
  // try and get documentDownloadUrl, should throw an error

  // login as an associated respondent
  // view the case
  // check for no link on the docket record
  // try and get documentDownloadUrl, should throw an error

  loginAs(test, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(test, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'NOTAREALNAMEFORTESTING',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkAddsPractitionersToCase(test);
  petitionsClerkAddsRespondentsToCase(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkSealsCase(test);
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order for a sealed case',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(test, 0);
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkServesDocument(test, 0);

  //verify that an internal user can still find this case via advanced search by name
  loginAs(test, 'petitionsclerk@example.com');
  associatedUserAdvancedSearchForSealedCase(test);

  //associated users
  loginAs(test, 'petitioner@example.com');
  associatedUserViewsCaseDetailForSealedCase(test);

  loginAs(test, 'privatePractitioner@example.com');
  associatedUserViewsCaseDetailForSealedCase(test);
  associatedUserAdvancedSearchForSealedCase(test);

  loginAs(test, 'irsPractitioner@example.com');
  associatedUserViewsCaseDetailForSealedCase(test);
  associatedUserAdvancedSearchForSealedCase(test);

  //unassociated users
  loginAs(test, 'privatePractitioner3@example.com');
  unassociatedUserViewsCaseDetailForSealedCase(test);
  unassociatedUserAdvancedSearchForSealedCase(test);
  externalUserSearchesForAnOrderOnSealedCase(test);

  loginAs(test, 'irsPractitioner3@example.com');
  unassociatedUserViewsCaseDetailForSealedCase(test);
  unassociatedUserAdvancedSearchForSealedCase(test);
});
