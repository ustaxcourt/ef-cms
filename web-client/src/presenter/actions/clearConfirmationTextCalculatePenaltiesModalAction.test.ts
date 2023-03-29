import { clearConfirmationTextForCalculatePenaltiesModalAction } from './clearConfirmationTextForCalculatePenaltiesModalAction';
import { runAction } from 'cerebral/test';

describe('clearConfirmationTextForCalculatePenaltiesModalAction', () => {
  it('should clear state.confirmationText.penalties', async () => {
    const { state } = await runAction(
      clearConfirmationTextForCalculatePenaltiesModalAction,
      {
        state: { confirmationText: { penalties: ['something'] } },
      },
    );

    expect(state.confirmationText.penalties).toBe([]);
  });
});
