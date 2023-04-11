import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserSearchesForSealedCaseByName = cerebralTest => {
  return it('Search for sealed case by name', async () => {
    await refreshElasticsearchIndex(6000);

    const queryParams = {
      petitionerName: 'Roland the Headless Thompson Gunner',
    };

    cerebralTest.setState('advancedSearchForm.caseSearchByName', queryParams);

    await cerebralTest.runSequence(
      'submitPublicCaseAdvancedSearchSequence',
      {},
    );

    const searchResults = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.CASE}`,
    );
    expect(searchResults.length).toEqual(0);
  });
};
