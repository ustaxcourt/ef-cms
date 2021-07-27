import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkSealsCase } from '../integration-tests/journey/docketClerkSealsCase';
import {
  loginAs,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { petitionsClerkServesElectronicCaseToIrs } from '../integration-tests/journey/petitionsClerkServesElectronicCaseToIrs';
import { setupTest } from './helpers';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import { unauthedUserSearchesForSealedCaseByName } from './journey/unauthedUserSearchesForSealedCaseByName';
import { unauthedUserSearchesForSealedCasesByDocketNumber } from './journey/unauthedUserSearchesForSealedCasesByDocketNumber';
import { unauthedUserViewsCaseDetailForSealedCase } from './journey/unauthedUserViewsCaseDetailForSealedCase';
import { unauthedUserViewsPrintableDocketRecordForSealedCase } from './journey/unauthedUserViewsPrintableDocketRecordForSealedCase';

const cerebralTest = setupTest();
const testClient = setupTestClient();
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

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

describe('Petitions clerk serves case to IRS', () => {
  loginAs(testClient, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(testClient);
});

describe('Docket clerk seals the case (should not be viewable to the public)', () => {
  loginAs(testClient, 'docketclerk@example.com');
  docketClerkSealsCase(testClient);
});

describe('Unauthed user searches for a sealed case by docket number', () => {
  unauthedUserNavigatesToPublicSite(cerebralTest);
  unauthedUserViewsCaseDetailForSealedCase(cerebralTest);
  unauthedUserViewsPrintableDocketRecordForSealedCase(cerebralTest);
});

describe('Unauthed user searches for a sealed case by name', () => {
  unauthedUserNavigatesToPublicSite(cerebralTest);
  unauthedUserSearchesForSealedCaseByName(cerebralTest);
  unauthedUserViewsPrintableDocketRecordForSealedCase(cerebralTest);
});

describe('Unauthed user searches for a sealed case and does not route to the case detail page', () => {
  unauthedUserNavigatesToPublicSite(cerebralTest);
  unauthedUserSearchesForSealedCasesByDocketNumber(cerebralTest);
});
