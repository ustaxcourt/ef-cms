import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';
import { docketClerkAddsDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkCreatesAnOrder } from '../integration-tests/journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from '../integration-tests/journey/docketClerkSealsCase';
import { docketClerkServesOrder } from '../integration-tests/journey/docketClerkServesOrder';
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

const test = setupTest();
const testClient = setupTestClient({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});
testClient.draftOrders = [];

describe('Petitioner creates case', () => {
  beforeAll(() => {
    jest.setTimeout(10000);
  });

  loginAs(testClient, 'petitioner');

  it('Create case', async () => {
    const caseDetail = await uploadPetition(testClient, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Somewhere',
        countryType: 'domestic',
        name: 'NOTAREALNAMEFORTESTINGPUBLIC',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    testClient.docketNumber = caseDetail.docketNumber;
  });
});

describe('Docket clerk creates orders to search for', () => {
  loginAs(testClient, 'docketclerk');
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkAddsDocketEntryFromOrder(testClient, 0);
  docketClerkServesOrder(testClient, 0);

  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkAddsDocketEntryFromOrderOfDismissal(testClient, 1);
  docketClerkServesOrder(testClient, 1);

  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkAddsDocketEntryFromOrderOfDismissal(testClient, 2);
});

describe('Unauthed user searches for an order by keyword', () => {
  unauthedUserNavigatesToPublicSite(test);
  unauthedUserInvalidSearchForOrder(test);
  unauthedUserSearchesForOrderByKeyword(test, testClient);
});

describe('Docket clerk seals case', () => {
  loginAs(testClient, 'docketclerk');
  docketClerkSealsCase(testClient);
});

describe('Unauthed user searches for an order by keyword and does not see sealed cases', () => {
  unauthedUserNavigatesToPublicSite(test);
  unauthedUserSearchesForSealedCaseOrderByKeyword(test, testClient);
});
