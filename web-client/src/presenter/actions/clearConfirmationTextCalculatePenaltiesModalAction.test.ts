import { clearConfirmationTextForCalculatePenaltiesModalAction } from './clearConfirmationTextForCalculatePenaltiesModalAction';
import { runAction } from 'cerebral/test';

describe('clearConfirmationTextForCalculatePenaltiesModalAction', () => {
  it('should clear state.confirmationText.penalties', async () => {
    const { state } = await runAction(
      clearConfirmationTextForCalculatePenaltiesModalAction,
      {
        state: { confirmationText: { penalties: { 0: 'something' } } },
      },
    );

    expect(state.confirmationText.penalties).toEqual({});
  });
});
