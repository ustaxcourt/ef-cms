import { resetPublicTrialSessionDataAction } from '@web-client/presenter/actions/resetPublicTrialSessionDataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetPublicTrialSessionDataAction', () => {
  it('should reset trial session data', async () => {
    const result = await runAction(resetPublicTrialSessionDataAction, {
      state: {
        publicTrialSessionData: { id: 123 },
      },
    });

    expect(result.state.publicTrialSessionData).toEqual({});
  });
});
