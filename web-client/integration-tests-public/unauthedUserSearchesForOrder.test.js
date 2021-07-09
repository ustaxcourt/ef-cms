import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkCreatesAnOrder } from '../integration-tests/journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from '../integration-tests/journey/docketClerkSealsCase';
import { docketClerkServesDocument } from '../integration-tests/journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from '../integration-tests/journey/docketClerkSignsOrder';
import {
  loginAs,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { setupTest } from './helpers';
import { unauthedUserInvalidSearchForOrder } from './journey/unauthedUserInvalidSearchForOrder';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import { unauthedUserSearchesForOrderByKeyword } from './journey/unauthedUserSearchesForOrderByKeyword';
import { unauthedUserSearchesForSealedCaseOrderByKeyword } from './journey/unauthedUserSearchesForSealedCaseOrderByKeyword';

const cerebralTest = setupTest();
const testClient = setupTestClient();
testClient.draftOrders = [];
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

// Temporarily disabled for story 7387
describe.skip('Petitioner creates case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(testClient, 'petitioner@example.com');

  it('Create case', async () => {
    const caseDetail = await uploadPetition(testClient, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'NOTAREALNAMEFORTESTINGPUBLIC',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
    testClient.docketNumber = caseDetail.docketNumber;
  });
});

describe.skip('Docket clerk creates orders to search for', () => {
  loginAs(testClient, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(testClient, 0);
  docketClerkAddsDocketEntryFromOrder(testClient, 0);
  docketClerkServesDocument(testClient, 0);

  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkSignsOrder(testClient, 1);
  docketClerkAddsDocketEntryFromOrderOfDismissal(testClient, 1);
  docketClerkServesDocument(testClient, 1);

  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkSignsOrder(testClient, 2);
  docketClerkAddsDocketEntryFromOrderOfDismissal(testClient, 2);
});

// Temporarily disabled for story 7387
describe.skip('Unauthed user searches for an order by keyword', () => {
  unauthedUserNavigatesToPublicSite(cerebralTest);
  unauthedUserInvalidSearchForOrder(cerebralTest);
  unauthedUserSearchesForOrderByKeyword(cerebralTest, testClient);
});

// Temporarily disabled for story 7387
describe.skip('Docket clerk seals case', () => {
  loginAs(testClient, 'docketclerk@example.com');
  docketClerkSealsCase(testClient);
});

// Temporarily disabled for story 7387
describe.skip('Unauthed user searches for an order by keyword and does not see sealed cases', () => {
  unauthedUserNavigatesToPublicSite(cerebralTest);
  unauthedUserSearchesForSealedCaseOrderByKeyword(cerebralTest, testClient);
});
