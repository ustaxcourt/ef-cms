import { incrementCurrentPageClosedCasesAction } from './incrementCurrentPageClosedCasesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('incrementCurrentPageClosedCasesAction', () => {
  it('increments state.closedCasesCurrentPage by 1', async () => {
    const result = await runAction(incrementCurrentPageClosedCasesAction, {
      modules: { presenter },
      state: { closedCasesCurrentPage: 2 },
    });

    expect(result.state.closedCasesCurrentPage).toEqual(3);
  });
});
