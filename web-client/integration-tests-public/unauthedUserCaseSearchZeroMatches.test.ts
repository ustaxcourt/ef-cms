import { ADVANCED_SEARCH_TABS } from '../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { setupTest } from './helpers';
import { setupTest as setupTestClient } from '../integration-tests/helpers';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';

const cerebralTest = setupTest();
const testClient = setupTestClient();
const { COUNTRY_TYPES } = applicationContext.getConstants();

testClient.draftOrders = [];

// user searches for case by "ZeroMatches DoNotMatchThis"
describe('Petitioner searches for exact name match', () => {
  afterAll(() => {
    testClient.closeSocket();
  });

  unauthedUserNavigatesToPublicSite(cerebralTest);

  it('returns zero search results when there are no matches', async () => {
    const queryParams = {
      countryType: COUNTRY_TYPES.DOMESTIC,
      currentPage: 1,
      petitionerName: 'ZeroMatches DoNotMatchThis',
    };

    cerebralTest.setState('advancedSearchForm.caseSearchByName', queryParams);
    await cerebralTest.runSequence(
      'submitPublicCaseAdvancedSearchSequence',
      {},
    );

    const searchResults = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.CASE}`,
    );

    expect(searchResults.length).toBe(0);
  });
});
