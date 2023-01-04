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

    expect(penalties.length).toEqual(5);
  });

  it('should keep the initial penalities as is when loading', async () => {
    const result = await runAction(setDefaultPenaltiesAction, {
      state: {
        form: {
          penalties: [
            {
              determinationPenaltyAmount: '1.00',
              irsPenaltyAmount: '5.00',
            },

            {
              determinationPenaltyAmount: '2.00',
              irsPenaltyAmount: '4.00',
            },

            {
              determinationPenaltyAmount: '3.00',
              irsPenaltyAmount: '4.00',
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
        determinationPenaltyAmount: '1.00',
        irsPenaltyAmount: '5.00',
      },
      {
        determinationPenaltyAmount: '2.00',
        irsPenaltyAmount: '4.00',
      },
      {
        determinationPenaltyAmount: '3.00',
        irsPenaltyAmount: '4.00',
      },
      {},
      {},
    ]);
  });
});
