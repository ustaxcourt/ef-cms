import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setDefaultWorkingCopySortAction } from './setDefaultWorkingCopySortAction';

describe('setDefaultWorkingCopySortAction', () => {
  it('should set the default sort and sort order when none is set', async () => {
    const result = await runAction(setDefaultWorkingCopySortAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(result.state.trialSessionWorkingCopy.sort).toEqual('docket');
    expect(result.state.trialSessionWorkingCopy.sortOrder).toEqual('asc');
  });

  it('should not set the default sort and sort order when it is already set', async () => {
    const result = await runAction(setDefaultWorkingCopySortAction, {
      modules: {
        presenter,
      },
      state: {
        trialSessionWorkingCopy: {
          sort: 'memphis',
          sortOrder: 'depay',
        },
      },
    });
    expect(result.state.trialSessionWorkingCopy.sort).toEqual('memphis');
    expect(result.state.trialSessionWorkingCopy.sortOrder).toEqual('depay');
  });
});
