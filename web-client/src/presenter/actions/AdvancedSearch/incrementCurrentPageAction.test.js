import { incrementCurrentPageAction } from './incrementCurrentPageAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('incrementCurrentPageAction', () => {
  it('increments state.form.currentPage by 1', async () => {
    const result = await runAction(incrementCurrentPageAction, {
      modules: { presenter },
      state: { form: { currentPage: 2 } },
    });

    expect(result.state.form.currentPage).toEqual(3);
  });
});
