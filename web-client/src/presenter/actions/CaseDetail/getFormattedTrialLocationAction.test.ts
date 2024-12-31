import { getFormattedTrialLocationAction } from './getFormattedTrialLocationAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getFormattedTrialLocationAction', () => {
  it('should return trialLocation from the trialLocationFilter if set', async () => {
    const result = await runAction(getFormattedTrialLocationAction, {
      state: {
        blockedCaseReportFilter: {
          trialLocationFilter: 'Boise, Idaho',
        },
      },
    });

    expect(result.output.trialLocation).toBe('Boise, Idaho');
  });

  it('should return trialLocation from the location if trialLocationFilter is not set', async () => {
    const result = await runAction(getFormattedTrialLocationAction, {
      state: {
        blockedCaseReportFilter: {},
        trialLocationPage: {
          location: 'Boise, Idaho',
        },
      },
    });

    expect(result.output.trialLocation).toBe('Boise, Idaho');
  });

  it('should return undefined if both trialLocationFilter and location are not set', async () => {
    const result = await runAction(getFormattedTrialLocationAction, {
      state: {
        blockedCaseReportFilter: {},
        trialLocationPage: {},
      },
    });

    expect(result.output.trialLocation).toBeUndefined();
  });
});
