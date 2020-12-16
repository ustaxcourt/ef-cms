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

const test = setupTest();
const testClient = setupTestClient();
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

testClient.draftOrders = [];

// exact match on contactPrimary.name

// add a case with the contactPrimary.name of "Bob Jones"
describe('Petitioner creates case to search for', () => {
  const nameToSearchFor = 'Bob Jones';

  beforeAll(() => {
    jest.setTimeout(10000);
  });

  loginAs(testClient, 'petitioner@example.com');

  it('Create case', async () => {
    const caseDetail = await uploadPetition(testClient, {
      contactPrimary: {
        address1: '734 Cowley Parkway',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: nameToSearchFor,
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
    });

    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    testClient.docketNumber = caseDetail.docketNumber;
  });
});

describe('Petitions clerk serves case to IRS', () => {
  loginAs(testClient, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(testClient);
});

// add a case with the contactPrimary.name of "Jones Bob"
// add a case with the contactPrimary.name of "Bob Smith Jones"
// add a case with the contactPrimary.name of "Bobby Jones" // won't show up
// add a case with the contactPrimary.name of "Bob Jonesy" // won't show up

// user searches for case by "Bob Jones"
describe('Petitioner searches for exact name match', () => {
  unauthedUserNavigatesToPublicSite(test);
  unauthedUserSearchesByMeta();
});

// expect Bob Jones is first
// expect Bob Smith Jones is second
// expect Jones Bob is third
// expect Bobby Jones to NOT be returned
// expect Bob Jonesy to NOT be returned
