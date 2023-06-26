import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialSessionsOnModalAction } from './setTrialSessionsOnModalAction';

describe('setTrialSessionsOnModalAction', () => {
  it('sets trial sessions on modal', async () => {
    const result = await runAction(setTrialSessionsOnModalAction, {
      props: {
        trialSessions: [
          { city: 'Flavortown', trialSessionId: 'trial-session-id-123' },
          { city: 'Flavortown', trialSessionId: 'trial-session-id-234' },
        ],
      },
    });

    expect(result.state.modal).toMatchObject({
      trialSessions: [
        { city: 'Flavortown', trialSessionId: 'trial-session-id-123' },
        { city: 'Flavortown', trialSessionId: 'trial-session-id-234' },
      ],
    });
  });
});
