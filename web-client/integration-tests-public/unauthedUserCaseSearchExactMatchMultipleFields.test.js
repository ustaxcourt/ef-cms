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

const [firstName, lastName] = [faker.name.firstName(), faker.name.lastName()];

const nameToSearchFor = `${firstName} ${lastName}`;

const createdDocketNumbers = [];

let notFoundDocketNumberOnContactPrimarySecondaryName;

const getContactPrimary = ({ name, secondaryName }) => ({
  address1: '734 Cowley Parkway',
  city: 'Somewhere',
  countryType: COUNTRY_TYPES.DOMESTIC,
  name: name || 'Rick Alex',
  phone: '+1 (884) 358-9729',
  postalCode: '77546',
  secondaryName: secondaryName || 'Ricky Other',
  state: 'CT',
});

const getContactSecondary = ({ name }) => ({
  address1: '734 Cowley Parkway',
  city: 'Somewhere',
  countryType: COUNTRY_TYPES.DOMESTIC,
  name: name || 'Frank Alan',
  phone: '+1 (884) 358-9729',
  postalCode: '77546',
  state: 'CT',
});

const updateCaseCaption = (docketNumber, caseCaption) => {
  loginAs(testClient, 'docketclerk@example.com');

  it(`updates the case caption for ${docketNumber} to ${caseCaption}`, async () => {
    await testClient.runSequence('gotoCaseDetailSequence', {
      docketNumber,
    });

    await testClient.runSequence('openUpdateCaseModalSequence');

    await testClient.runSequence('updateModalValueSequence', {
      key: 'caseCaption',
      value: caseCaption,
    });

    await testClient.runSequence('submitUpdateCaseModalSequence');
    expect(testClient.getState('caseDetail.caseCaption')).toEqual(caseCaption);
  });
};

describe('Create and serve a case to test contactPrimary.name', () => {
  describe('Petitioner creates case', () => {
    beforeAll(() => {
      jest.setTimeout(20000);
    });

    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient, {
        contactPrimary: getContactPrimary({ name: nameToSearchFor }),
      });

      expect(caseDetail.docketNumber).toBeDefined();
      cerebralTest.docketNumber = caseDetail.docketNumber;
      testClient.docketNumber = caseDetail.docketNumber;
      createdDocketNumbers.push(caseDetail.docketNumber);
    });

    updateCaseCaption(
      cerebralTest.docketNumber,
      'Best match on contact primary name, Petitioner',
    ); // This is to ensure the results are based solely on the contact information, and not caseCaption
  });

  describe('Petitions clerk serves case to IRS', () => {
    loginAs(testClient, 'petitionsclerk@example.com');
    petitionsClerkServesElectronicCaseToIrs(testClient);
  });
});

describe('Create and serve a case to test contactPrimary.secondaryName', () => {
  describe('Petitioner creates case', () => {
    beforeAll(() => {
      jest.setTimeout(30000);
    });

    afterAll(() => {
      cerebralTest.closeSocket();
    });

    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient, {
        contactPrimary: getContactPrimary({ secondaryName: nameToSearchFor }),
      });

      expect(caseDetail.docketNumber).toBeDefined();
      cerebralTest.docketNumber = caseDetail.docketNumber;
      testClient.docketNumber = caseDetail.docketNumber;
      notFoundDocketNumberOnContactPrimarySecondaryName =
        caseDetail.docketNumber;
    });

    updateCaseCaption(
      cerebralTest.docketNumber,
      "string matches on contact primary's secondary name but will not turn up in a search, Petitioner",
    ); // This is to ensure the results are based solely on the contact information, and not caseCaption
  });

  describe('Petitions clerk serves case to IRS', () => {
    loginAs(testClient, 'petitionsclerk@example.com');
    petitionsClerkServesElectronicCaseToIrs(testClient);
  });
});

describe('Create and serve a case to test contactSecondary.name', () => {
  describe('Petitioner creates case', () => {
    beforeAll(() => {
      jest.setTimeout(30000);
    });

    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient, {
        contactSecondary: getContactSecondary({ name: nameToSearchFor }),
        partyType: 'Petitioner & spouse',
      });

      expect(caseDetail.docketNumber).toBeDefined();
      cerebralTest.docketNumber = caseDetail.docketNumber;
      testClient.docketNumber = caseDetail.docketNumber;
      createdDocketNumbers.push(caseDetail.docketNumber);
    });

    updateCaseCaption(
      cerebralTest.docketNumber,
      'second-best match on contactSecondary.name, Petitioner',
    ); // This is to ensure the results are based solely on the contact information, and not caseCaption
  });

  describe('Petitions clerk serves case to IRS', () => {
    loginAs(testClient, 'petitionsclerk@example.com');
    petitionsClerkServesElectronicCaseToIrs(testClient);
  });
});

describe('Create and serve a case to test caseCaption', () => {
  describe('Petitioner creates case', () => {
    beforeAll(() => {
      jest.setTimeout(30000);
    });

    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient);

      expect(caseDetail.docketNumber).toBeDefined();
      cerebralTest.docketNumber = caseDetail.docketNumber;
      testClient.docketNumber = caseDetail.docketNumber;
      createdDocketNumbers.push(caseDetail.docketNumber);
    });

    const newCaseCaption = `${nameToSearchFor}, name on caseCaption, third-best match, Petitioner`;
    updateCaseCaption(cerebralTest.docketNumber, newCaseCaption);
  });

  describe('Petitions clerk serves case to IRS', () => {
    loginAs(testClient, 'petitionsclerk@example.com');
    petitionsClerkServesElectronicCaseToIrs(testClient);
  });
});

describe('Create and serve a case to test contactPrimary.name with terms out of order that shows last in search results', () => {
  describe('Petitioner creates case', () => {
    beforeAll(() => {
      jest.setTimeout(30000);
    });

    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient, {
        contactPrimary: getContactPrimary({ name: `${lastName} ${firstName}` }),
      });

      expect(caseDetail.docketNumber).toBeDefined();
      cerebralTest.docketNumber = caseDetail.docketNumber;
      testClient.docketNumber = caseDetail.docketNumber;
      createdDocketNumbers.push(caseDetail.docketNumber);
    });

    updateCaseCaption(
      cerebralTest.docketNumber,
      'fourth-best match of out-of-order terms on contactPrimary.name, Petitioner',
    ); // This is to ensure the results are based solely on the contact information, and not caseCaption
  });

  describe('Petitions clerk serves case to IRS', () => {
    loginAs(testClient, 'petitionsclerk@example.com');
    petitionsClerkServesElectronicCaseToIrs(testClient);
  });
});

describe('Petitioner searches for exact name match', () => {
  unauthedUserNavigatesToPublicSite(cerebralTest);

  it(`returns search results we expect in the correct order when searching for "${firstName} ${lastName}"`, async () => {
    const queryParams = {
      countryType: COUNTRY_TYPES.DOMESTIC,
      currentPage: 1,
      petitionerName: nameToSearchFor,
    };

    cerebralTest.setState('advancedSearchForm.caseSearchByName', queryParams);
    await cerebralTest.runSequence(
      'submitPublicCaseAdvancedSearchSequence',
      {},
    );

    const searchResults = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.CASE}`,
    );

    expect(searchResults.length).toBe(createdDocketNumbers.length);

    expect(searchResults[0]).toMatchObject({
      docketNumber: createdDocketNumbers[0],
    });

    expect(searchResults[1]).toMatchObject({
      docketNumber: createdDocketNumbers[1],
    });

    expect(searchResults[2]).toMatchObject({
      docketNumber: createdDocketNumbers[2],
    });

    expect(searchResults[3]).toMatchObject({
      docketNumber: createdDocketNumbers[3],
    });

    expect(
      searchResults.find(
        ({ docketNumber }) =>
          docketNumber === notFoundDocketNumberOnContactPrimarySecondaryName,
      ),
    ).toBeUndefined();
  });
});
