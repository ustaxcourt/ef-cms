import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialSessionIdAction } from './setTrialSessionIdAction';

describe('setTrialSessionIdAction', () => {
  it('sets trial session id', async () => {
    const result = await runAction(setTrialSessionIdAction, {
      props: {
        trialSessionId: 'trial-session-id-123',
      },
    });

    expect(result.state).toMatchObject({
      trialSession: { trialSessionId: 'trial-session-id-123' },
    });
  });
});
