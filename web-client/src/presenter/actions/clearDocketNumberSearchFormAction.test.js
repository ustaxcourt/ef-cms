import { clearDocketNumberSearchFormAction } from './clearDocketNumberSearchFormAction';
import { runAction } from 'cerebral/test';

describe.only('clearDocketNumberSearchFormAction', () => {
  it('should clear the docket number field in the advanced search form', async () => {
    const result = await runAction(clearDocketNumberSearchFormAction, {
      state: {
        advancedSearchForm: { currentPage: 82, docketNumber: '123-45' },
        searchResults: [{ caseId: '1' }, { caseId: '2' }],
      },
    });

    expect(result.state.advancedSearchForm).toEqual({ currentPage: 1 });
    expect(result.state.searchResults).toBeUndefined();
  });
});
