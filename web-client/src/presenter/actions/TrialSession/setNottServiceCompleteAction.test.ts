import { MOCK_TRIAL_INPERSON } from '../../../../../shared/src/test/mockTrial';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setNottServiceCompleteAction } from './setNottServiceCompleteAction';

describe('setNottServiceCompleteAction', () => {
  it('should set hasNOTTBeenServed to true for the trial session on state', async () => {
    const { state } = await runAction(setNottServiceCompleteAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          ...MOCK_TRIAL_INPERSON,
          hasNOTTBeenServed: false,
        },
      },
    });

    expect(state.trialSession.hasNOTTBeenServed).toEqual(true);
  });
});
