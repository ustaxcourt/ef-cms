import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import {
  fakeFile,
  getFormattedDocumentQCSectionInbox,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';
import { irsPractitionerViewsPetitionerInfoForUnassociatedCase } from './journey/irsPractitionerViewsPetitionerInfoForUnassociatedCase';
import { petitionsClerkAddsDocketEntryFromOrder } from './journey/petitionsClerkAddsDocketEntryFromOrder';
import { petitionsClerkCreateOrder } from './journey/petitionsClerkCreateOrder';
import { petitionsClerkServesOrder } from './journey/petitionsClerkServesOrder';
import { petitionsClerkSignsOrder } from './journey/petitionsClerkSignsOrder';
import { practitionerCreatesNewCase } from './journey/practitionerCreatesNewCase';
import { practitionerFilesDocumentForOwnedCase } from './journey/practitionerFilesDocumentForOwnedCase';
import { practitionerRequestsAccessToCase } from './journey/practitionerRequestsAccessToCase';
import { practitionerRequestsPendingAccessToCase } from './journey/practitionerRequestsPendingAccessToCase';
import { practitionerSearchesForCase } from './journey/practitionerSearchesForCase';
import { practitionerSearchesForNonexistentCase } from './journey/practitionerSearchesForNonexistentCase';
import { practitionerViewsCaseDetail } from './journey/practitionerViewsCaseDetail';
import { practitionerViewsCaseDetailOfOwnedCase } from './journey/practitionerViewsCaseDetailOfOwnedCase';
import { practitionerViewsCaseDetailOfPendingCase } from './journey/practitionerViewsCaseDetailOfPendingCase';
import { practitionerViewsCaseDetailWithPublicOrder } from './journey/practitionerViewsCaseDetailWithPublicOrder';
import { practitionerViewsDashboard } from './journey/practitionerViewsDashboard';
import { practitionerViewsDashboardBeforeAddingCase } from './journey/practitionerViewsDashboardBeforeAddingCase';

const testObj = setupTest();
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('Practitioner requests access to case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  //tests for practitioner starting a new case
  loginAs(testObj, 'privatePractitioner@example.com');
  practitionerCreatesNewCase(testObj, fakeFile);
  practitionerViewsCaseDetailOfOwnedCase(testObj);

  // verify petition filed by private practitioner can be found in petitions Section Document QC
  loginAs(testObj, 'petitionsclerk@example.com');
  it('Petitions clerk views Section Document QC', async () => {
    await testObj.runSequence('navigateToPathSequence', {
      path: '/document-qc/section/inbox',
    });
    const workQueueToDisplay = testObj.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('section');
    expect(workQueueToDisplay.box).toEqual('inbox');

    const inbox = await getFormattedDocumentQCSectionInbox(testObj);
    const found = inbox.find(
      workItem => workItem.docketNumber === testObj.docketNumber,
    );

    expect(found).toBeTruthy();
  });

  //tests for practitioner requesting access to existing case
  //petitioner must first create a case for practitioner to request access to
  loginAs(testObj, 'petitioner@example.com');
  it('Create test case #1', async () => {
    const caseDetail = await uploadPetition(testObj, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimothy Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    testObj.docketNumber = caseDetail.docketNumber;
  });

  loginAs(testObj, 'privatePractitioner@example.com');
  practitionerSearchesForNonexistentCase(testObj);
  practitionerViewsDashboardBeforeAddingCase(testObj);
  practitionerSearchesForCase(testObj);
  practitionerViewsCaseDetail(testObj, false);
  practitionerRequestsAccessToCase(testObj, fakeFile);
  practitionerViewsDashboard(testObj);
  practitionerViewsCaseDetailOfOwnedCase(testObj);
  practitionerFilesDocumentForOwnedCase(testObj, fakeFile);

  //tests for practitioner requesting access to existing case
  //petitioner must first create a case for practitioner to request access to
  loginAs(testObj, 'petitioner@example.com');
  it('Create test case #2', async () => {
    const caseDetail = await uploadPetition(testObj, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimothy Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    testObj.docketNumber = caseDetail.docketNumber;
  });

  // create and serve an order that the privatePractitioner
  // should be able to view even when they are not associated with the case
  loginAs(testObj, 'petitionsclerk@example.com');
  petitionsClerkCreateOrder(testObj);
  petitionsClerkSignsOrder(testObj);
  petitionsClerkAddsDocketEntryFromOrder(testObj);
  petitionsClerkServesOrder(testObj);

  loginAs(testObj, 'privatePractitioner@example.com');
  practitionerSearchesForCase(testObj);
  practitionerViewsCaseDetailWithPublicOrder(testObj, false);
  practitionerRequestsPendingAccessToCase(testObj, fakeFile);
  practitionerViewsCaseDetailOfPendingCase(testObj);

  loginAs(testObj, 'irsPractitioner@example.com');
  irsPractitionerViewsPetitionerInfoForUnassociatedCase(testObj);

  loginAs(testObj, 'docketclerk@example.com');
  docketClerkSealsCase(testObj);
  loginAs(testObj, 'irsPractitioner@example.com');
  irsPractitionerViewsPetitionerInfoForUnassociatedCase(testObj, true); // passing flag for isSealed
});
