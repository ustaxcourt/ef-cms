import { PublicClientState } from '@web-client/presenter/state-public';
import { resetPublicTrialSessionDataAction } from '@web-client/presenter/actions/resetPublicTrialSessionDataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetPublicTrialSessionDataAction', () => {
  it('should reset trial session data', async () => {
    const result = await runAction<void, PublicClientState>(
      resetPublicTrialSessionDataAction,
      {
        state: {
          publicTrialSessionData: { id: 123 },
        },
      },
    );

    expect(result.state.publicTrialSessionData).toEqual({});
  });
});
