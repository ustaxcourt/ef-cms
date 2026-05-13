import { runAction } from '@web-client/presenter/test.cerebral';
import { setDismissedAlertForNottAction } from './setDismissedAlertForNottAction';

describe('setDismissedAlertForNottAction', () => {
  it('should set dismissedAlertForNott to true on state.trialSession', async () => {
    const { state } = await runAction(setDismissedAlertForNottAction, {
      state: {
        trialSession: {
          dismissedAlertForNott: false,
        },
      },
    });

    expect(state.trialSession.dismissedAlertForNott).toBe(true);
  });
});
