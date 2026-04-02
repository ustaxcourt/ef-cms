import { runAction } from '@web-client/presenter/test.cerebral';
import { setConfirmTrialSessionStartDateChangeModalAction } from './setConfirmTrialSessionStartDateChangeModalAction';

describe('setConfirmTrialSessionStartDateChangeModalAction', () => {
  it('should set state.modal.showModal to ConfirmTrialSessionStartDateChangeModalDialog', async () => {
    const { state } = await runAction(
      setConfirmTrialSessionStartDateChangeModalAction,
      {
        state: {},
      },
    );

    expect(state.modal.showModal).toEqual(
      'ConfirmTrialSessionStartDateChangeModalDialog',
    );
  });
});
