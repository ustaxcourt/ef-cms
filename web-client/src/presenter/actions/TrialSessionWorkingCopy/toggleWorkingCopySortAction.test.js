import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { toggleWorkingCopySortAction } from './toggleWorkingCopySortAction';

describe('toggleWorkingCopySortAction', () => {
  it('should set the sort and default the sort order to asc when selecting a different sort', async () => {
    const result = await runAction(toggleWorkingCopySortAction, {
      modules: {
        presenter,
      },
      props: {
        sort: 'docket',
      },
      state: {
        trialSessionWorkingCopy: {
          sort: 'practitioner',
          sortOrder: 'desc',
        },
      },
    });
    expect(result.state.trialSessionWorkingCopy.sort).toEqual('docket');
    expect(result.state.trialSessionWorkingCopy.sortOrder).toEqual('asc');
  });

  it('should toggle the sort order when the sort is already set', async () => {
    const result = await runAction(toggleWorkingCopySortAction, {
      modules: {
        presenter,
      },
      props: {
        sort: 'docket',
      },
      state: {
        trialSessionWorkingCopy: {
          sort: 'docket',
          sortOrder: 'asc',
        },
      },
    });
    expect(result.state.trialSessionWorkingCopy.sort).toEqual('docket');
    expect(result.state.trialSessionWorkingCopy.sortOrder).toEqual('desc');
  });
});
