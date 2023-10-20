import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultWorkingCopyValuesAction } from './setDefaultWorkingCopyValuesAction';

presenter.providers.applicationContext = applicationContext;
describe('setDefaultWorkingCopyValuesAction', () => {
  it('should set the default sort, sort order, and filters when none is set', async () => {
    const result = await runAction(setDefaultWorkingCopyValuesAction, {
      modules: {
        presenter,
      },
      state: {
        trialSessionWorkingCopy: {
          caseMetadata: {},
        },
      },
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
          caseMetadata: {},
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

  it('should convert all `settled` trial status types to `basisReached`', async () => {
    const result = await runAction(setDefaultWorkingCopyValuesAction, {
      modules: {
        presenter,
      },
      state: {
        featureFlags: {
          'updated-trial-status-types': true,
        },
        trialSessionWorkingCopy: {
          caseMetadata: {
            '101-20': {
              trialStatus: 'settled',
            },
            '102-20': {
              trialStatus: 'settled',
            },
            '103-20': {
              trialStatus: 'basisReached',
            },
          },
        },
      },
    });

    expect(result.state.trialSessionWorkingCopy.caseMetadata).toEqual({
      '101-20': {
        trialStatus: 'basisReached',
      },
      '102-20': {
        trialStatus: 'basisReached',
      },
      '103-20': {
        trialStatus: 'basisReached',
      },
    });
  });
});
