import { getTrialSessionIdAction } from './getTrialSessionIdAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getTrialSessionIdAction', () => {
  it('should return state.trialSessionId to props', async () => {
    const mockTrialSessionId = '8b5e4c17-2ac0-45f7-b293-09799356c6c7';

    const { output } = await runAction(getTrialSessionIdAction, {
      state: {
        trialSessionId: mockTrialSessionId,
      },
    });

    expect(output.trialSessionId).toEqual(mockTrialSessionId);
  });
});
