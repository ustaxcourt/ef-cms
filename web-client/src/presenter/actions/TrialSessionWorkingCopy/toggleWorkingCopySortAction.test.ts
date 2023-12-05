import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { toggleWorkingCopySortAction } from './toggleWorkingCopySortAction';

describe('toggleWorkingCopySortAction', () => {
  it('should set the sort field and sort order', async () => {
    const result = await runAction(toggleWorkingCopySortAction, {
      modules: {
        presenter,
      },
      props: {
        sortField: 'docket',
        sortOrder: 'asc',
      },
      state: {
        trialSessionWorkingCopy: {
          sort: undefined,
          sortOrder: undefined,
        },
      },
    });
    expect(result.state.trialSessionWorkingCopy.sort).toEqual('docket');
    expect(result.state.trialSessionWorkingCopy.sortOrder).toEqual('asc');
  });
});
