import { formatAndSetPenaltiesAction } from './formatAndSetPenaltiesAction';
import { runAction } from 'cerebral/test';

describe('formatAndSetPenaltiesAction', () => {
  //TODO: temporary for smaller PR, will expand tests when functionaltity expands
  it('should format penalties with property irsPenaltyAmount', async () => {
    const { state } = await runAction(formatAndSetPenaltiesAction, {
      state: {
        modal: { penalties: [{ irsPenaltyAmount: '30', name: 'Penalty 1' }] },
      },
    });

    expect(state.form.penalties).toEqual([
      { irsPenaltyAmount: '30.00', name: 'Penalty 1' },
    ]);
  });
});
