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

const cerebralTest = setupTest();
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('Practitioner requests access to case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  //tests for practitioner starting a new case
  loginAs(cerebralTest, 'privatePractitioner@example.com');
  practitionerCreatesNewCase(cerebralTest, fakeFile);
  practitionerViewsCaseDetailOfOwnedCase(cerebralTest);

  // verify petition filed by private practitioner can be found in petitions Section Document QC
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  it('Petitions clerk views Section Document QC', async () => {
    await cerebralTest.runSequence('navigateToPathSequence', {
      path: '/document-qc/section/inbox',
    });
    const workQueueToDisplay = cerebralTest.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('section');
    expect(workQueueToDisplay.box).toEqual('inbox');

    const inbox = await getFormattedDocumentQCSectionInbox(cerebralTest);
    const found = inbox.find(
      workItem => workItem.docketNumber === cerebralTest.docketNumber,
    );

    expect(found).toBeTruthy();
  });

  //tests for practitioner requesting access to existing case
  //petitioner must first create a case for practitioner to request access to
  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case #1', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
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
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  practitionerSearchesForNonexistentCase(cerebralTest);
  practitionerViewsDashboardBeforeAddingCase(cerebralTest);
  practitionerSearchesForCase(cerebralTest);
  practitionerViewsCaseDetail(cerebralTest, false);
  practitionerRequestsAccessToCase(cerebralTest, fakeFile);
  practitionerViewsDashboard(cerebralTest);
  practitionerViewsCaseDetailOfOwnedCase(cerebralTest);
  practitionerFilesDocumentForOwnedCase(cerebralTest, fakeFile);

  //tests for practitioner requesting access to existing case
  //petitioner must first create a case for practitioner to request access to
  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case #2', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
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
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  // create and serve an order that the privatePractitioner
  // should be able to view even when they are not associated with the case
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreateOrder(cerebralTest);
  petitionsClerkSignsOrder(cerebralTest);
  petitionsClerkAddsDocketEntryFromOrder(cerebralTest);
  petitionsClerkServesOrder(cerebralTest);

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  practitionerSearchesForCase(cerebralTest);
  practitionerViewsCaseDetailWithPublicOrder(cerebralTest);
  practitionerRequestsPendingAccessToCase(cerebralTest, fakeFile);
  practitionerViewsCaseDetailOfPendingCase(cerebralTest);

  loginAs(cerebralTest, 'irsPractitioner@example.com');
  irsPractitionerViewsPetitionerInfoForUnassociatedCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSealsCase(cerebralTest);
  loginAs(cerebralTest, 'irsPractitioner@example.com');
  irsPractitionerViewsPetitionerInfoForUnassociatedCase(cerebralTest, true); // passing flag for isSealed
});
