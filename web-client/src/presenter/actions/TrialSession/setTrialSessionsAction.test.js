import { runAction } from 'cerebral/test';
import { setTrialSessionsAction } from './setTrialSessionsAction';

describe('setTrialSessionsAction', () => {
  it('sets trial sessions', async () => {
    const result = await runAction(setTrialSessionsAction, {
      props: {
        trialSessions: [
          { city: 'Flavortown', trialSessionId: 'trial-session-id-123' },
          { city: 'Flavortown', trialSessionId: 'trial-session-id-234' },
        ],
      },
    });

    expect(result.state).toMatchObject({
      trialSessions: [
        { city: 'Flavortown', trialSessionId: 'trial-session-id-123' },
        { city: 'Flavortown', trialSessionId: 'trial-session-id-234' },
      ],
    });
  });
});
