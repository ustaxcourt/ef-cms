import { runAction } from 'cerebral/test';
import { setDefaultPenaltiesAction } from './setDefaultPenaltiesAction';

describe('setDefaultPenaltiesAction', () => {
  it('sets a default state for the penalties array', async () => {
    const result = await runAction(setDefaultPenaltiesAction, {
      state: {
        modal: {
          penalties: null,
        },
      },
    });

    const { penalties } = result.state.modal;

    expect(penalties.length).toEqual(1);
  });

  it('should keep the all penalities with names when loading', async () => {
    const result = await runAction(setDefaultPenaltiesAction, {
      state: {
        form: {
          penalties: [
            {
              irsPenaltyAmount: '5.00',
              // determinationPenaltyAmount: '1.00',
              name: 'Penalty1',
            },

            {
              irsPenaltyAmount: '4.00',
              // determinationPenaltyAmount: '2.00',
              name: 'Penalty2',
            },

            {
              irsPenaltyAmount: '4.00',
              // determinationPenaltyAmount: '3.00',,
            },
          ],
        },
        modal: {
          penalties: null,
        },
      },
    });

    const { penalties } = result.state.modal;

    expect(penalties).toEqual([
      {
        irsPenaltyAmount: '5.00',
        // determinationPenaltyAmount: '1.00',
        name: 'Penalty1',
      },

      {
        irsPenaltyAmount: '4.00',
        // determinationPenaltyAmount: '2.00',
        name: 'Penalty2',
      },
    ]);
  });
});
