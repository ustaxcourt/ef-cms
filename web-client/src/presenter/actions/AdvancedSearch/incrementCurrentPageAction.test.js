import { incrementCurrentPageAction } from './incrementCurrentPageAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('incrementCurrentPageAction', () => {
  it('increments state.advancedSearchForm.currentPage by 1', async () => {
    const result = await runAction(incrementCurrentPageAction, {
      modules: { presenter },
      state: { advancedSearchForm: { currentPage: 2 } },
    });

    expect(result.state.advancedSearchForm.currentPage).toEqual(3);
  });
});
