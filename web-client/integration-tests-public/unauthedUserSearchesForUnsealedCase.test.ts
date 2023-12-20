import {
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkCreatesAnOrder } from '../integration-tests/journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from '../integration-tests/journey/docketClerkSealsCase';
import { docketClerkServesDocument } from '../integration-tests/journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from '../integration-tests/journey/docketClerkSignsOrder';
import { docketClerkUnsealsCase } from '../integration-tests/journey/docketClerkUnsealsCase';
import {
  loginAs,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { petitionsClerkServesElectronicCaseToIrs } from '../integration-tests/journey/petitionsClerkServesElectronicCaseToIrs';
import { setupTest } from './helpers';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import { unauthedUserSearchesForOrderByKeyword } from './journey/unauthedUserSearchesForOrderByKeyword';

describe('Unauthed user sees unsealed case', () => {
  const cerebralTest = setupTest();
  const testClient = setupTestClient();

  testClient.draftOrders = [];

  describe('Petitioner creates case', () => {
    afterAll(() => {
      testClient.closeSocket();
    });

    loginAs(testClient, 'petitioner@example.com');

    it('petitioner creates an electronic case', async () => {
      const { docketNumber } = await uploadPetition(testClient, {
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

      expect(docketNumber).toBeDefined();

      cerebralTest.docketNumber = docketNumber;
      testClient.docketNumber = docketNumber;
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

  describe('Docket clerk seals then unseals case', () => {
    afterAll(() => {
      testClient.closeSocket();
    });

    loginAs(testClient, 'docketclerk@example.com');
    docketClerkSealsCase(testClient);
    docketClerkUnsealsCase(testClient);
  });

  describe('Unauthed user searches for an order by keyword and sees unsealed case', () => {
    afterAll(() => {
      testClient.closeSocket();
    });

    unauthedUserNavigatesToPublicSite(cerebralTest);
    unauthedUserSearchesForOrderByKeyword(cerebralTest, testClient);
  });
});
