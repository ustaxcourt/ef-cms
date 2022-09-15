import { getTrialSessionWorkingCopyRedirectUrlAction } from './getTrialSessionWorkingCopyRedirectUrlAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getTrialSessionWorkingCopyRedirectUrlAction', () => {
  it('should get correct redirectUrl', async () => {
    // set up state
    const result = await runAction(
      getTrialSessionWorkingCopyRedirectUrlAction,
      {
        modules: {
          presenter,
        },
        state: {
          formattedTrialSessionDetails: {
            trialSessionId: 'someId',
          },
        },
      },
    );
    expect(result.output.redirectUrl).toEqual(
      '/trial-session-working-copy/someId',
    );
  });
});
