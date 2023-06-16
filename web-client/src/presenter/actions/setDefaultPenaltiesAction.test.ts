import { runAction } from '@web-client/presenter/test.cerebral';
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

  it('should filter out penalties that do not match penaltyType passed in props', async () => {
    const result = await runAction(setDefaultPenaltiesAction, {
      props: { subkey: 'irsPenaltyAmount' },
      state: {
        form: {
          penalties: [
            {
              name: 'Penalty 1 (IRS)',
              penaltyAmount: '5.00',
              penaltyType: 'irsPenaltyAmount',
            },

            {
              name: 'Penalty 2 (IRS)',
              penaltyAmount: '4.00',
              penaltyType: 'irsPenaltyAmount',
            },

            {
              name: 'Penalty 1 (Court)',
              penaltyAmount: '4.00',
              penaltyType: 'determinationPenaltyAmount',
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
        name: 'Penalty 1 (IRS)',
        penaltyAmount: '5.00',
        penaltyType: 'irsPenaltyAmount',
      },

      {
        name: 'Penalty 2 (IRS)',
        penaltyAmount: '4.00',
        penaltyType: 'irsPenaltyAmount',
      },
    ]);
  });

  it('should set penalties off the statistic penalties array on state.form when a statisticIndex is passed in on props', async () => {
    const result = await runAction(setDefaultPenaltiesAction, {
      props: { statisticIndex: 1, subkey: 'irsPenaltyAmount' },
      state: {
        form: {
          statistics: [
            {},
            {
              penalties: [
                {
                  name: 'Penalty 1 (IRS)',
                  penaltyAmount: '5.00',
                  penaltyType: 'irsPenaltyAmount',
                },

                {
                  name: 'Penalty 2 (IRS)',
                  penaltyAmount: '4.00',
                  penaltyType: 'irsPenaltyAmount',
                },

                {
                  name: 'Penalty 1 (Court)',
                  penaltyAmount: '4.00',
                  penaltyType: 'determinationPenaltyAmount',
                },
              ],
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
        name: 'Penalty 1 (IRS)',
        penaltyAmount: '5.00',
        penaltyType: 'irsPenaltyAmount',
      },

      {
        name: 'Penalty 2 (IRS)',
        penaltyAmount: '4.00',
        penaltyType: 'irsPenaltyAmount',
      },
    ]);
  });
});
