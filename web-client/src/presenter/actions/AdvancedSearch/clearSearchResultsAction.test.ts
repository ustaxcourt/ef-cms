import { clearSearchResultsAction } from './clearSearchResultsAction';
import { runAction } from 'cerebral/test';

describe('clearSearchResultsAction', () => {
  it('clears searchResults and sets advancedSearchForm.currentPage to 1', async () => {
    const result = await runAction(clearSearchResultsAction, {
      state: {
        advancedSearchForm: {
          caseSearchByName: { petitionerName: 'Bubbles' },
          currentPage: 85,
        },
        searchResults: [{ barNumber: '1111' }],
      },
    });

    expect(result.state).toEqual({
      advancedSearchForm: {
        caseSearchByName: { petitionerName: 'Bubbles' },
        currentPage: 1,
      },
    });
  });
});
