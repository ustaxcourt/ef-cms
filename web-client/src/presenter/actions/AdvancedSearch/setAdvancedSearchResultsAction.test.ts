import { runAction } from '@web-client/presenter/test.cerebral';
import { setAdvancedSearchResultsAction } from './setAdvancedSearchResultsAction';

describe('setAdvancedSearchResultsAction', () => {
  it('should set correct state.searchResults property to the passed in props.searchResults based on state.advancedSearchTab', async () => {
    const result = await runAction(setAdvancedSearchResultsAction, {
      props: { searchResults: [{ barNumber: '1111' }] },
      state: {
        advancedSearchTab: 'practitioner',
      },
    });

    expect(result.state.searchResults.practitioner).toEqual([
      { barNumber: '1111' },
    ]);
  });
});
