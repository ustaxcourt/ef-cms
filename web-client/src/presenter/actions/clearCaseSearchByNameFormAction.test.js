import { clearCaseSearchByNameFormAction } from './clearCaseSearchByNameFormAction';
import { runAction } from 'cerebral/test';

describe.only('clearCaseSearchByNameFormAction', () => {
  it('should clear the advanced search form case search by name fields', async () => {
    const result = await runAction(clearCaseSearchByNameFormAction, {
      state: {
        advancedSearchForm: {
          countryType: 'international',
          currentPage: 83,
          petitionerName: 'bob',
          petitionerState: 'TN',
          sure: 'yes',
        },
        searchResults: [{ caseId: '1' }, { caseId: '2' }],
      },
    });

    expect(result.state.advancedSearchForm).toEqual({
      countryType: 'domestic',
      currentPage: 1,
      sure: 'yes',
    });
    expect(result.state.searchResults).toBeUndefined();
  });
});
