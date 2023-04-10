import { clearConfirmationTextAction } from './clearConfirmationTextAction';
import { runAction } from 'cerebral/test';

describe('clearConfirmationTextAction', () => {
  it('should unset state.confirmationText', async () => {
    const { state } = await runAction(clearConfirmationTextAction, {
      state: { confirmationText: 'This is a confirmation' },
    });

    expect(state.confirmationText).toBeUndefined();
  });
});
