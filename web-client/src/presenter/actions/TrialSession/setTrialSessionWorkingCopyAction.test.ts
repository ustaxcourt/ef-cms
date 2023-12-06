import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialSessionWorkingCopyAction } from './setTrialSessionWorkingCopyAction';

describe('setTrialSessionWorkingCopyAction', () => {
  it('sets trial sessions on modal', async () => {
    const result = await runAction(setTrialSessionWorkingCopyAction, {
      props: {
        trialSessionWorkingCopy: {
          city: 'Flavortown',
          trialSessionId: 'trial-session-id-123',
        },
      },
    });

    expect(result.state).toMatchObject({
      trialSessionWorkingCopy: {
        city: 'Flavortown',
        trialSessionId: 'trial-session-id-123',
      },
    });
  });
});
