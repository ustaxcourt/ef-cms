import {
  ADVANCED_SEARCH_TABS,
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { faker } from '@faker-js/faker';
import {
  loginAs,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { petitionsClerkServesElectronicCaseToIrs } from '../integration-tests/journey/petitionsClerkServesElectronicCaseToIrs';
import { setupTest } from './helpers';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';

const cerebralTest = setupTest();
const testClient = setupTestClient();

testClient.draftOrders = [];

const firstName = faker.person.firstName();

const baseContact = {
  address1: '734 Cowley Parkway',
  city: 'Somewhere',
  countryType: COUNTRY_TYPES.DOMESTIC,
  name: firstName,
  phone: '+1 (884) 358-9729',
  postalCode: '77546',
  state: 'CT',
};

const createdDocketNumbers = [];

const searchTerm = firstName;

/**
 * add a case with the contactSecondary.name provided
 */
describe(`Petitioner creates cases with name ${firstName}`, () => {
  afterAll(() => {
    testClient.closeSocket();
  });

  loginAs(testClient, 'petitioner@example.com');

  let i = 0;
  while (i < 4) {
    it('Create case with contactSecondary name matching search term', async () => {
      const caseDetail = await uploadPetition(testClient, {
        contactSecondary: { ...baseContact },
        partyType: PARTY_TYPES.petitionerSpouse,
      });

      expect(caseDetail.docketNumber).toBeDefined();
      cerebralTest.docketNumber = caseDetail.docketNumber;
      testClient.docketNumber = caseDetail.docketNumber;
      createdDocketNumbers.push(caseDetail.docketNumber);
    });

    loginAs(testClient, 'petitionsclerk@example.com');
    petitionsClerkServesElectronicCaseToIrs(testClient);

    i++;
  }

  it('Create case with contactPrimary name matching search term', async () => {
    const caseDetail = await uploadPetition(testClient, {
      contactPrimary: { ...baseContact },
    });

    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
    testClient.docketNumber = caseDetail.docketNumber;
    createdDocketNumbers.push(caseDetail.docketNumber);
  });

  loginAs(testClient, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(testClient);
});

describe('Petitioner searches for exact name match', () => {
  unauthedUserNavigatesToPublicSite(cerebralTest);

  it('should return case with contactPrimary name match as the first result and case with contactSecondary name match as the second result', async () => {
    const queryParams = {
      currentPage: 1,
      petitionerName: searchTerm,
    };

    cerebralTest.setState('advancedSearchForm.caseSearchByName', queryParams);
    await cerebralTest.runSequence(
      'submitPublicCaseAdvancedSearchSequence',
      {},
    );

    const searchResults = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.CASE}`,
    );

    expect(searchResults.length).not.toBeLessThan(5);
    expect(searchResults[0]).toMatchObject({
      docketNumber: createdDocketNumbers[4], // case with contactPrimary name match should be first
    });
  });
});
