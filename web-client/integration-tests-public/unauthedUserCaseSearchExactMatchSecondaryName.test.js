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

const test = setupTest();
const testClient = setupTestClient();
const { COUNTRY_TYPES } = applicationContext.getConstants();

testClient.draftOrders = [];

// exact match on contactPrimary.secondaryName
const baseContactPrimary = {
  address1: '734 Cowley Parkway',
  city: 'Somewhere',
  countryType: COUNTRY_TYPES.DOMESTIC,
  name: 'Rick Alex',
  phone: '+1 (884) 358-9729',
  postalCode: '77546',
  state: 'CT',
};

const lastName = faker.name.lastName();

const createdDocketNumbers = [];

const searchTerm = `Bob ${lastName}`;
const primaryContactSecondaryNames = [
  `Bob ${lastName}`,
  `${lastName} Bob`,
  `Bob Smith ${lastName}`,
  `Bobby ${lastName}`,
  `Bobby ${lastName}sy`,
];

primaryContactSecondaryNames.forEach(createCaseWithPrimaryContactSecondaryName);

/**
 * create case with secondary name on primary contact as provided
 */
function createCaseWithPrimaryContactSecondaryName(secondaryName) {
  describe(`Create and serve a case for ${secondaryName}`, () => {
    describe(`Petitioner creates case for ${secondaryName}`, () => {
      beforeAll(() => {
        jest.setTimeout(10000);
      });

      loginAs(testClient, 'petitioner@example.com');

      it('Create case', async () => {
        const caseDetail = await uploadPetition(testClient, {
          contactPrimary: { ...baseContactPrimary, secondaryName },
        });

        expect(caseDetail.docketNumber).toBeDefined();
        test.docketNumber = caseDetail.docketNumber;
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

describe(`Petitioner searches for exact name match for term ${searchTerm}`, () => {
  unauthedUserNavigatesToPublicSite(test);

  it('returns search results we expect in the correct order', async () => {
    const queryParams = {
      countryType: COUNTRY_TYPES.DOMESTIC,
      currentPage: 1,
      petitionerName: searchTerm,
    };

    test.setState('advancedSearchForm.caseSearchByName', queryParams);
    await test.runSequence('submitPublicCaseAdvancedSearchSequence', {});

    const searchResults = test.getState(
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
