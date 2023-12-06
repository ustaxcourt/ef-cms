import { incrementCurrentPageOpenCasesAction } from './incrementCurrentPageOpenCasesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('incrementCurrentPageOpenCasesAction', () => {
  it('increments state.openCasesCurrentPage by 1', async () => {
    const result = await runAction(incrementCurrentPageOpenCasesAction, {
      modules: { presenter },
      state: { openCasesCurrentPage: 2 },
    });

    expect(result.state.openCasesCurrentPage).toEqual(3);
  });
});
