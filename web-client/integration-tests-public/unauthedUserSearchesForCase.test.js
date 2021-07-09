import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';

import { docketClerkAddsDocketEntryFromOrderOfDismissal } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkAddsStipulatedDecisionDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsStipulatedDecisionDocketEntryFromOrder';
import { docketClerkAddsTranscriptDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsTranscriptDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from '../integration-tests/journey/docketClerkCreatesAnOrder';
import { docketClerkServesDocument } from '../integration-tests/journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from '../integration-tests/journey/docketClerkSignsOrder';
import {
  loginAs,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { petitionsClerkServesElectronicCaseToIrs } from '../integration-tests/journey/petitionsClerkServesElectronicCaseToIrs';
import { setupTest } from './helpers';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import { unauthedUserSearchesByDocketNumber } from './journey/unauthedUserSearchesByDocketNumber';
import { unauthedUserSearchesByMeta } from './journey/unauthedUserSearchesByMeta';
import { unauthedUserViewsCaseDetail } from './journey/unauthedUserViewsCaseDetail';
import { unauthedUserViewsPrintableDocketRecord } from './journey/unauthedUserViewsPrintableDocketRecord';

const cerebralTest = setupTest();
const testClient = setupTestClient();
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

testClient.draftOrders = [];

describe('Petitioner creates case to search for', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(testClient, 'petitioner@example.com');

  it('Create case', async () => {
    const caseDetail = await uploadPetition(testClient, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Aliens, Dude',
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

describe('Petitions clerk serves case to IRS', () => {
  loginAs(testClient, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(testClient);
});

describe('Docket clerk creates a draft order (should not be viewable to the public)', () => {
  loginAs(testClient, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
});

describe('Docket clerk creates and serves an order (should be viewable to the public)', () => {
  loginAs(testClient, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkSignsOrder(testClient, 1);
  docketClerkAddsDocketEntryFromOrderOfDismissal(testClient, 1);
  docketClerkServesDocument(testClient, 1);
});

describe('Docket clerk creates a transcript but does not serve it (transcripts are unservable, should not be viewable to the public)', () => {
  loginAs(testClient, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkAddsTranscriptDocketEntryFromOrder(testClient, 2, {
    day: '01',
    month: '01',
    year: '2019',
  });
});

describe('Docket clerk creates and serves a Stipulated Decision (should not be viewable to the public)', () => {
  loginAs(testClient, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkSignsOrder(testClient, 3);
  docketClerkAddsStipulatedDecisionDocketEntryFromOrder(testClient, 3);
  docketClerkServesDocument(testClient, 3);
});

describe('Unauthed user searches for a case and views a case detail page', () => {
  unauthedUserNavigatesToPublicSite(cerebralTest);
  unauthedUserSearchesByMeta(cerebralTest);
  unauthedUserSearchesByDocketNumber(cerebralTest, testClient);
  unauthedUserViewsCaseDetail(cerebralTest);
  unauthedUserViewsPrintableDocketRecord(cerebralTest);
});
