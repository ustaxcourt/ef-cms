import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDefaultWorkingCopyValuesAction } from './setDefaultWorkingCopyValuesAction';

describe('setDefaultWorkingCopyValuesAction', () => {
  it('should set the default sort, sort order, and filters when none is set', async () => {
    const result = await runAction(setDefaultWorkingCopyValuesAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(result.state.trialSessionWorkingCopy.sort).toEqual('docket');
    expect(result.state.trialSessionWorkingCopy.sortOrder).toEqual('asc');
    expect(result.state.trialSessionWorkingCopy.filters).toEqual({
      basisReached: true,
      continued: true,
      definiteTrial: true,
      dismissed: true,
      motionToDismiss: true,
      probableSettlement: true,
      probableTrial: true,
      recall: true,
      rule122: true,
      setForTrial: true,
      settled: true,
      showAll: true,
      statusUnassigned: true,
      submittedCAV: true,
    });
  });

  it('should not set the default sort, sort order, and filters when it is already set', async () => {
    const result = await runAction(setDefaultWorkingCopyValuesAction, {
      modules: {
        presenter,
      },
      state: {
        trialSessionWorkingCopy: {
          filters: {
            basisReached: false,
            continued: false,
            dismissed: false,
            recall: false,
          },
          sort: 'memphis',
          sortOrder: 'depay',
        },
      },
    });
    expect(result.state.trialSessionWorkingCopy.sort).toEqual('memphis');
    expect(result.state.trialSessionWorkingCopy.sortOrder).toEqual('depay');
    expect(result.state.trialSessionWorkingCopy.filters).toEqual({
      basisReached: false,
      continued: false,
      dismissed: false,
      recall: false,
    });
  });
});
