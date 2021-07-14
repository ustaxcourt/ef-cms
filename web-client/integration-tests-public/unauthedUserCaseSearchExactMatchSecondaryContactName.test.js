import { ADVANCED_SEARCH_TABS } from '../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  loginAs,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { petitionsClerkServesElectronicCaseToIrs } from '../integration-tests/journey/petitionsClerkServesElectronicCaseToIrs';
import { setupTest } from './helpers';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import faker from 'faker';

const cerebralTest = setupTest();
const testClient = setupTestClient();
const { COUNTRY_TYPES } = applicationContext.getConstants();

testClient.draftOrders = [];

const baseContactSecondary = {
  address1: '734 Cowley Parkway',
  city: 'Somewhere',
  countryType: COUNTRY_TYPES.DOMESTIC,
  phone: '+1 (884) 358-9729',
  postalCode: '77546',
  state: 'CT',
};

const lastName = faker.name.lastName();
const createdDocketNumbers = [];

const searchTerm = `Bob ${lastName}`;
const secondaryNames = [
  `Bob ${lastName}`,
  `${lastName} Bob`,
  `Bob Smith ${lastName}`,
  `Bobby ${lastName}`,
  `Bobby ${lastName}sy`,
];

secondaryNames.forEach(createCaseWithSecondaryName);

/**
 * add a case with the contactSecondary.name provided
 */
function createCaseWithSecondaryName(name) {
  describe(`Create and serve a case for ${name}`, () => {
    describe(`Petitioner creates case for ${name}`, () => {
      beforeAll(() => {
        jest.setTimeout(30000);
      });

      afterAll(() => {
        cerebralTest.closeSocket();
      });

      loginAs(testClient, 'petitioner@example.com');

      it('Create case', async () => {
        const caseDetail = await uploadPetition(testClient, {
          contactSecondary: { ...baseContactSecondary, name },
          partyType: 'Petitioner & spouse',
        });

        expect(caseDetail.docketNumber).toBeDefined();
        cerebralTest.docketNumber = caseDetail.docketNumber;
        testClient.docketNumber = caseDetail.docketNumber;
        createdDocketNumbers.push(caseDetail.docketNumber);
      });
    });

    describe('Petitions clerk serves case to IRS', () => {
      loginAs(testClient, 'petitionsclerk@example.com');
      petitionsClerkServesElectronicCaseToIrs(testClient);
    });
  });
}

describe('Petitioner searches for exact name match', () => {
  unauthedUserNavigatesToPublicSite(cerebralTest);

  it('returns search results we expect in the correct order', async () => {
    const queryParams = {
      countryType: COUNTRY_TYPES.DOMESTIC,
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

    expect(searchResults.length).toBe(3);
    expect(searchResults[0]).toMatchObject({
      docketNumber: createdDocketNumbers[0],
    });
    expect(searchResults[1]).toMatchObject({
      docketNumber: createdDocketNumbers[1],
    });
    expect(searchResults[2]).toMatchObject({
      docketNumber: createdDocketNumbers[2],
    });
  });
});
