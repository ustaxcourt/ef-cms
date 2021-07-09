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

// exact match on contactPrimary.name

const getContactPrimary = name => ({
  address1: '734 Cowley Parkway',
  city: 'Somewhere',
  countryType: COUNTRY_TYPES.DOMESTIC,
  name,
  phone: '+1 (884) 358-9729',
  postalCode: '77546',
  state: 'CT',
});

const createdDocketNumbers = [];

const firstName = `CoPriNa${faker.name.firstName()}`; // "Bob"
const lastName = `CPNLast${faker.name.lastName()}`; // "Evans"
const anotherFirstName = faker.name.firstName(); // "Jones"
const middleName = faker.name.firstName(); // "Trisha"
const similarName = `${firstName}bby`; // "Bobby"

const searchTerm = `${firstName} ${anotherFirstName}`;

const caseNamesToCreate = [
  `${firstName} ${lastName}`, // Bob Evans
  `${anotherFirstName} ${lastName}`, // Jones Evans
  `${firstName} ${middleName} ${lastName}`, // Bob Trisha Evans
  `${similarName} ${lastName}`, // Bobby Evans
];

caseNamesToCreate.forEach(createCase);

/**
 *
 */
function createCase(name) {
  describe(`Create and serve a case for ${name}`, () => {
    describe(`Petitioner creates case for ${name}`, () => {
      const nameToSearchFor = name;

      beforeAll(() => {
        jest.setTimeout(30000);
      });

      afterAll(() => {
        cerebralTest.closeSocket();
      });

      loginAs(testClient, 'petitioner@example.com');
      it('Create case', async () => {
        const caseDetail = await uploadPetition(testClient, {
          contactPrimary: getContactPrimary(nameToSearchFor),
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

describe.skip(`Petitioner searches for partial name match ${searchTerm}`, () => {
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

    expect(searchResults).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          contactPrimary: expect.objectContaining({
            name: caseNamesToCreate[0],
          }),
        }),
        expect.objectContaining({
          contactPrimary: expect.objectContaining({
            name: caseNamesToCreate[1],
          }),
        }),
        expect.objectContaining({
          contactPrimary: expect.objectContaining({
            name: caseNamesToCreate[2],
          }),
        }),
      ]),
    );
  });
});
