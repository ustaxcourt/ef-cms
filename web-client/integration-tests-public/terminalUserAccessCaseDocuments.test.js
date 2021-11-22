import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';

import {
  loginAs,
  setWhitelistIps,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { petitionsClerkServesElectronicCaseToIrs } from '../integration-tests/journey/petitionsClerkServesElectronicCaseToIrs';
import { setupTest } from './helpers';
import { terminalUserVerifiesPetitionIsHyperlinked } from './journey/terminalUserVerifiesPetitionIsHyperlinked';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import { unauthedUserSearchesByDocketNumber } from './journey/unauthedUserSearchesByDocketNumber';

const cerebralTest = setupTest();
const testClient = setupTestClient();
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

testClient.draftOrders = [];

describe('terminal user verifies they can click on document links', () => {
  // setup dynamo to have the whitelisted IP

  beforeAll(() => {
    jest.setTimeout(30000);
    cerebralTest.draftOrders = [];
  });

  afterAll(() => {
    testClient.closeSocket();
  });

  describe('Petitioner creates case to search for', () => {
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

  describe('terminal user searches for a case and views a case detail page', () => {
    beforeAll(async () => {
      await setWhitelistIps(['localhost']);
    });

    afterAll(async () => {
      await setWhitelistIps([]);
    });

    unauthedUserNavigatesToPublicSite(cerebralTest);
    unauthedUserSearchesByDocketNumber(cerebralTest, testClient);
    terminalUserVerifiesPetitionIsHyperlinked(cerebralTest);
  });
});
