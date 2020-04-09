import { clearCaseSearchByNameFormAction } from './clearCaseSearchByNameFormAction';
import { runAction } from 'cerebral/test';

describe.only('clearCaseSearchByNameFormAction', () => {
  it('should clear the advanced search form case search by name fields', async () => {
    const result = await runAction(clearCaseSearchByNameFormAction, {
      state: {
        advancedSearchForm: {
          caseSearchByName: {
            countryType: 'international',
            petitionerName: 'bob',
            petitionerState: 'TN',
            sure: 'yes',
          },
          currentPage: 83,
        },
        searchResults: [{ caseId: '1' }, { caseId: '2' }],
      },
    });

    expect(result.state.advancedSearchForm).toEqual({
      caseSearchByName: { countryType: 'domestic' },
      currentPage: 1,
    });
    expect(result.state.searchResults).toBeUndefined();
  });
});
