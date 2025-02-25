import { PUBLIC_TRIAL_SESSIONS_DATA_KEY } from '@shared/business/entities/EntityConstants';
import { PublicClientState } from '@web-client/presenter/state-public';
import { resetPublicTrialSessionsDataAction } from '@web-client/presenter/actions/resetPublicTrialSessionsDataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetPublicTrialSessionsDataAction', () => {
  it('should reset trial sessions data', async () => {
    const result = await runAction<void, PublicClientState>(
      resetPublicTrialSessionsDataAction,
      {
        state: {
          [PUBLIC_TRIAL_SESSIONS_DATA_KEY]: { id: 123 },
        },
      },
    );

    expect(result.state[PUBLIC_TRIAL_SESSIONS_DATA_KEY]).toEqual({});
  });
});
