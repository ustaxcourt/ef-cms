import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkSealsCase } from '../integration-tests/journey/docketClerkSealsCase';
import {
  loginAs,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { setupTest } from './helpers';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import { unauthedUserSearchesForSealedCaseByName } from './journey/unauthedUserSearchesForSealedCaseByName';
import { unauthedUserSearchesForSealedCasesByDocketNumber } from './journey/unauthedUserSearchesForSealedCasesByDocketNumber';
import { unauthedUserViewsCaseDetailForSealedCase } from './journey/unauthedUserViewsCaseDetailForSealedCase';
import { unauthedUserViewsPrintableDocketRecord } from './journey/unauthedUserViewsPrintableDocketRecord';

const test = setupTest();
const testClient = setupTestClient();
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('Petitioner creates cases to search for', () => {
  beforeAll(() => {
    jest.setTimeout(10000);
  });

  loginAs(testClient, 'petitioner');

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
    test.docketNumber = caseDetail.docketNumber;
    testClient.docketNumber = caseDetail.docketNumber;
  });
});

describe('Docket clerk seals the case (should not be viewable to the public)', () => {
  loginAs(testClient, 'docketclerk');
  docketClerkSealsCase(testClient);
});

describe('Unauthed user searches for a sealed case by docket number', () => {
  unauthedUserNavigatesToPublicSite(test);
  unauthedUserViewsCaseDetailForSealedCase(test);
  unauthedUserViewsPrintableDocketRecord(test);
});

describe('Unauthed user searches for a sealed case by name', () => {
  unauthedUserNavigatesToPublicSite(test);
  unauthedUserSearchesForSealedCaseByName(test);
  unauthedUserViewsPrintableDocketRecord(test);
});

describe('Unauthed user searches for a sealed case and does not route to the case detail page', () => {
  unauthedUserNavigatesToPublicSite(test);
  unauthedUserSearchesForSealedCasesByDocketNumber(test);
});
