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

const lastName = faker.name.lastName();

const createdDocketNumbers = [];

// add a case with the contactPrimary.name of "Bob Jones"
describe(`Create and serve a case for Bob ${lastName}`, () => {
  describe(`Petitioner creates case for Bob ${lastName}`, () => {
    const nameToSearchFor = `Bob ${lastName}`;

    beforeAll(() => {
      jest.setTimeout(10000);
    });

    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient, {
        contactPrimary: getContactPrimary(nameToSearchFor),
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

// add a case with the contactPrimary.name of "Jones Bob"
describe(`Create and serve a case for ${lastName} Bob`, () => {
  describe(`Petitioner creates case for ${lastName} Bob`, () => {
    const nameToSearchFor = `${lastName} Bob`;

    beforeAll(() => {
      jest.setTimeout(10000);
    });

    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient, {
        contactPrimary: getContactPrimary(nameToSearchFor),
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

// add a case with the contactPrimary.name of "Bob Smith Jones"
describe(`Create and serve a case for Bob Smith ${lastName}`, () => {
  describe(`Petitioner creates case for Bob Smith ${lastName}`, () => {
    const nameToSearchFor = `Bob Smith ${lastName}`;

    beforeAll(() => {
      jest.setTimeout(10000);
    });

    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient, {
        contactPrimary: getContactPrimary(nameToSearchFor),
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

// add a case with the contactPrimary.name of "Bobby Jones" // won't show up
describe(`Create and serve a case for Bobby ${lastName}`, () => {
  describe(`Petitioner creates case for Bobby ${lastName}`, () => {
    const nameToSearchFor = `Bobby ${lastName}`;

    beforeAll(() => {
      jest.setTimeout(10000);
    });

    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient, {
        contactPrimary: getContactPrimary(nameToSearchFor),
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

// add a case with the contactPrimary.name of "Bob Jonesy" // won't show up
describe(`Create and serve a case for Bobby ${lastName}sy`, () => {
  describe(`Petitioner creates case for Bobby ${lastName}sy`, () => {
    const nameToSearchFor = `Bobby ${lastName}sy`;

    beforeAll(() => {
      jest.setTimeout(10000);
    });

    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient, {
        contactPrimary: getContactPrimary(nameToSearchFor),
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

// user searches for case by "Bob Jones"
describe('Petitioner searches for exact name match', () => {
  unauthedUserNavigatesToPublicSite(test);

  it('returns search results we expect in the correct order', async () => {
    const queryParams = {
      countryType: COUNTRY_TYPES.DOMESTIC,
      currentPage: 1,
      petitionerName: `Bob ${lastName}`,
    };

    test.setState('advancedSearchForm.caseSearchByName', queryParams);
    await test.runSequence('submitPublicCaseAdvancedSearchSequence', {});

    const searchResults = test.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.CASE}`,
    );

    expect(searchResults.length).toBe(3);
    // expect Bob Jones is first
    expect(searchResults[0]).toMatchObject({
      docketNumber: createdDocketNumbers[0],
    });

    // expect Bob Smith Jones is second
    expect(searchResults[1]).toMatchObject({
      docketNumber: createdDocketNumbers[1],
    });

    // expect Jones Bob is third
    expect(searchResults[2]).toMatchObject({
      docketNumber: createdDocketNumbers[2],
    });
  });
});
