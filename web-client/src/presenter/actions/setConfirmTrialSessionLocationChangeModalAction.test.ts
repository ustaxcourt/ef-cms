import { runAction } from '@web-client/presenter/test.cerebral';
import { setConfirmTrialSessionLocationChangeModalAction } from '@web-client/presenter/actions/setConfirmTrialSessionLocationChangeModalAction';

describe('setConfirmTrialSessionLocationChangeModalAction', () => {
  it('should set the correct value for "showModal"', async () => {
    const { state } = await runAction(
      setConfirmTrialSessionLocationChangeModalAction,
      {},
    );

    expect(state.modal.showModal).toEqual(
      'ConfirmTrialSessionLocationChangeModalDialog',
    );
  });
});
