import {
  ADVANCED_SEARCH_TABS,
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkCreatesAnOrder } from '../integration-tests/journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from '../integration-tests/journey/docketClerkSealsCase';
import { docketClerkServesDocument } from '../integration-tests/journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from '../integration-tests/journey/docketClerkSignsOrder';
import {
  loginAs,
  setupTest as setupTestClient,
  updateOrderForm,
  uploadPetition,
} from '../integration-tests/helpers';
import { petitionsClerkServesElectronicCaseToIrs } from '../integration-tests/journey/petitionsClerkServesElectronicCaseToIrs';
import { setupTest } from './helpers';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import { unauthedUserSearchesForOrderByKeyword } from './journey/unauthedUserSearchesForOrderByKeyword';
import { unauthedUserSearchesForSealedCaseOrderByKeyword } from './journey/unauthedUserSearchesForSealedCaseOrderByKeyword';

const cerebralTest = setupTest();
const testClient = setupTestClient();

describe('Petitioner creates case', () => {
  testClient.draftOrders = [];

  afterAll(() => {
    testClient.closeSocket();
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

  loginAs(testClient, 'petitionsclerk1@example.com');
  petitionsClerkServesElectronicCaseToIrs(testClient);
});

describe('Docket clerk creates orders to search for', () => {
  afterAll(() => {
    testClient.closeSocket();
  });

  loginAs(testClient, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(testClient);
  docketClerkAddsDocketEntryFromOrder(testClient, 0);
  docketClerkServesDocument(testClient, 0);

  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkSignsOrder(testClient);
  docketClerkAddsDocketEntryFromOrderOfDismissal(testClient, 1);
  docketClerkServesDocument(testClient, 1);

  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkSignsOrder(testClient);
  docketClerkAddsDocketEntryFromOrderOfDismissal(testClient, 2);
});

describe('Unauthed user searches for an order by keyword', () => {
  afterAll(() => {
    testClient.closeSocket();
  });

  unauthedUserNavigatesToPublicSite(cerebralTest);
  unauthedUserSearchesForOrderByKeyword(cerebralTest, testClient);
});

describe('Docket clerk seals case', () => {
  afterAll(() => {
    testClient.closeSocket();
  });

  loginAs(testClient, 'docketclerk@example.com');
  docketClerkSealsCase(testClient);
});

describe('Unauthed user searches for an order by keyword and does not see sealed cases', () => {
  afterAll(() => {
    testClient.closeSocket();
  });

  unauthedUserNavigatesToPublicSite(cerebralTest);
  unauthedUserSearchesForSealedCaseOrderByKeyword(cerebralTest, testClient);
});

describe('Unauthed user searches for an order by docket number and does not see orders that are sealed', () => {
  afterAll(() => {
    testClient.closeSocket();
  });

  unauthedUserNavigatesToPublicSite(cerebralTest);
  it('search for sealed order by docket number', async () => {
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.docketNumber = '999-15';

    await updateOrderForm(cerebralTest, {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('submitPublicOrderAdvancedSearchSequence');

    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: cerebralTest.docketNumber,
          documentTitle: 'Sealed Order',
        }),
      ]),
    );
  });
});
