import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { initialTrialSessionState } from '@web-client/presenter/state/trialSessionState';
import { resetTrialSessionAction } from './resetTrialSessionAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetTrialSessionAction', () => {
  it('should reset the loaded session', async () => {
    const result = await runAction(resetTrialSessionAction, {
      state: {
        trialSession: { ...MOCK_TRIAL_REGULAR, isCalendared: true },
      },
    });

    expect(result.state.trialSession).toEqual(initialTrialSessionState);
  });
});
