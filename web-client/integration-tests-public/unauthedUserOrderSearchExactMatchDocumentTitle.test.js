import { ADVANCED_SEARCH_TABS } from '../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrder';
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
import faker from 'faker';

const test = setupTest();
const testClient = setupTestClient();
const { COUNTRY_TYPES } = applicationContext.getConstants();

const updatedLastName = faker.name.lastName();
const createdDocketNumbers = [];

const getContactPrimary = () => ({
  address1: '734 Cowley Parkway',
  city: 'Somewhere',
  countryType: COUNTRY_TYPES.DOMESTIC,
  name: 'Rick Alex',
  phone: '+1 (884) 358-9729',
  postalCode: '77546',
  state: 'CT',
});

describe('Create and serve a case for Bob Jones', () => {
  describe('Petitioner creates case for Bob Jones', () => {
    beforeAll(() => {
      jest.setTimeout(10000);
    });

    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient, {
        contactPrimary: getContactPrimary(),
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

  describe('Docket clerk creates an order on the case', () => {
    loginAs(testClient, 'docketclerk@example.com');
    loginAs(test, 'docketclerk@example.com');

    docketClerkCreatesAnOrder(test, {
      documentContents: 'pigeon',
      documentTitle: 'Sunglasses',
      eventCode: 'O',
      expectedDocumentType: 'Order',
      signedAtFormatted: '01/02/2020',
    });
    docketClerkSignsOrder(test, 0);
    docketClerkAddsDocketEntryFromOrder(test, 0);
    docketClerkServesDocument(test, 0);

    docketClerkCreatesAnOrder(test, {
      documentContents: 'pigeon',
      documentTitle: 'Sunglassesy',
      eventCode: 'O',
      expectedDocumentType: 'Order',
      signedAtFormatted: '01/02/2020',
    });
    docketClerkSignsOrder(test, 1);
    docketClerkAddsDocketEntryFromOrder(test, 1);
    docketClerkServesDocument(test, 1);
  });
});

describe('Create and serve a case for Rick Alex', () => {
  describe('Petitioner creates case for Rick Alex', () => {
    beforeAll(() => {
      jest.setTimeout(10000);
    });

    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient, {
        contactPrimary: getContactPrimary(),
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

describe('Create and serve a case for Rick Alex', () => {
  describe('Petitioner creates case for Rick Alex', () => {
    beforeAll(() => {
      jest.setTimeout(10000);
    });

    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient, {
        contactPrimary: getContactPrimary(),
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

describe('Create and serve a case for name: Rick Alex', () => {
  describe('Petitioner creates case for name: Rick Alex', () => {
    beforeAll(() => {
      jest.setTimeout(10000);
    });

    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient, {
        contactPrimary: getContactPrimary(),
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

describe('Create and serve a case for name: Rick Alex', () => {
  describe('Petitioner creates case for name: Rick Alex', () => {
    beforeAll(() => {
      jest.setTimeout(10000);
    });

    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient, {});

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

describe('Petitioner searches for exact name match', () => {
  unauthedUserNavigatesToPublicSite(test);

  it('returns search results we expect in the correct order', async () => {
    const queryParams = {
      countryType: COUNTRY_TYPES.DOMESTIC,
      currentPage: 1,
      petitionerName: `Rupert ${updatedLastName}`,
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
