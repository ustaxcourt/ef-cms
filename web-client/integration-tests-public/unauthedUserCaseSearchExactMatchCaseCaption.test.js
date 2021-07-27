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

const updatedLastName = faker.name.lastName();
const createdDocketNumbers = [];

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

const captionSearchTerm = `Rupert ${updatedLastName}`;
const caseCaptionNames = [
  `Rupert ${updatedLastName}`,
  `${updatedLastName} Rupert`,
  `Rupert Federico ${updatedLastName}`,
  `Ruperto ${updatedLastName}`,
  `Rupert ${updatedLastName}y`,
];

caseCaptionNames.forEach(createCaseWithCaption);

/**
 * Creates and serves a case with the desired caption string.
 */
function createCaseWithCaption(captionString) {
  describe(`Create and serve a case with "${captionString}" in the case caption`, () => {
    describe('Petitioner creates the case with the desired caption string', () => {
      beforeAll(() => {
        jest.setTimeout(30000);
      });

      afterAll(() => {
        cerebralTest.closeSocket();
      });

      loginAs(testClient, 'petitioner@example.com');

      it('Creates the case', async () => {
        const caseDetail = await uploadPetition(testClient);

        expect(caseDetail.docketNumber).toBeDefined();
        cerebralTest.docketNumber = caseDetail.docketNumber;
        testClient.docketNumber = caseDetail.docketNumber;
        createdDocketNumbers.push(caseDetail.docketNumber);
      });

      const newCaseCaption = `${captionString}, Petitioner`;
      updateCaseCaption(cerebralTest.docketNumber, newCaseCaption);
    });

    describe('Petitions clerk serves case to IRS', () => {
      loginAs(testClient, 'petitionsclerk@example.com');
      petitionsClerkServesElectronicCaseToIrs(testClient);
    });
  });
}

describe('Petitioner searches for exact name match', () => {
  unauthedUserNavigatesToPublicSite(cerebralTest);

  it(`returns search results for ${captionSearchTerm} we expect in the correct order`, async () => {
    const queryParams = {
      countryType: COUNTRY_TYPES.DOMESTIC,
      currentPage: 1,
      petitionerName: captionSearchTerm,
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
