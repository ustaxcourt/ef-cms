import { clearAdvancedSearchFormAction } from './clearAdvancedSearchFormAction';
import { runAction } from 'cerebral/test';

describe.only('clearAdvancedSearchFormAction', () => {
  it('should clear the advanced search form, setting currentPage to 1 as a default, and clear the state.searchResults', async () => {
    const result = await runAction(clearAdvancedSearchFormAction, {
      state: {
        advancedSearchForm: { currentPage: 83, sure: 'yes' },
        searchResults: [{ caseId: '1' }, { caseId: '2' }],
      },
    });

    expect(result.state.advancedSearchForm).toEqual({ currentPage: 1 });
    expect(result.state.searchResults).toBeUndefined();
  });
});
