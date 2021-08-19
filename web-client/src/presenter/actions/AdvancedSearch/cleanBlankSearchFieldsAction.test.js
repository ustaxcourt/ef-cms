import { cleanBlankSearchFieldsAction } from './cleanBlankSearchFieldsAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('cleanBlankSearchFieldsAction', () => {
  it('should clear the advanced search form if any of the properties are empty strings', async () => {
    const result = await runAction(cleanBlankSearchFieldsAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {
          orderSearch: { dateRange: 'allDates', docketNumber: '', keyword: '' },
        },
      },
    });

    expect(result.state.advancedSearchForm).toEqual({
      orderSearch: { dateRange: 'allDates' },
    });
  });
});
