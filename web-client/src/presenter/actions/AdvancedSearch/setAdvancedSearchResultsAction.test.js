import { runAction } from 'cerebral/test';
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

  it('should use default advancedSearchTab case to set state.searchResults', async () => {
    const result = await runAction(setAdvancedSearchResultsAction, {
      props: { searchResults: [{ docketNumber: '1111-11' }] },
      state: {},
    });

    expect(result.state.searchResults.case).toEqual([
      { docketNumber: '1111-11' },
    ]);
  });
});
