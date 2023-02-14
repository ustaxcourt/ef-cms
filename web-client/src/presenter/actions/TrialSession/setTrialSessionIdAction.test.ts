import { runAction } from 'cerebral/test';
import { setTrialSessionIdAction } from './setTrialSessionIdAction';

describe('setTrialSessionIdAction', () => {
  it('sets trial session id', async () => {
    const result = await runAction(setTrialSessionIdAction, {
      props: {
        trialSessionId: 'trial-session-id-123',
      },
    });

    expect(result.state).toMatchObject({
      trialSessionId: 'trial-session-id-123',
    });
  });
});
