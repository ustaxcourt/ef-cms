import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { calculatePenaltiesAction } from './calculatePenaltiesAction';
import { runAction } from 'cerebral/test';

describe('calculatePenaltiesAction', () => {
  it('computes the total of all penalties', async () => {
    const result = await runAction(calculatePenaltiesAction, {
      props: {},
      state: {
        modal: {
          penalties: [
            {
              name: 'Penalty 1 (IRS)',
              penaltyAmount: '1.00',
              penaltyType:
                applicationContext.getConstants().PENALTY_TYPES
                  .IRS_PENALTY_AMOUNT,
            },
            {
              name: 'Penalty 2 (IRS)',
              penaltyAmount: '2.00',
              penaltyType:
                applicationContext.getConstants().PENALTY_TYPES
                  .IRS_PENALTY_AMOUNT,
            },
            {
              name: 'Penalty 3 (IRS)',
              penaltyAmount: '3.00',
              penaltyType:
                applicationContext.getConstants().PENALTY_TYPES
                  .IRS_PENALTY_AMOUNT,
            },
          ],
          subkey: 'irsPenaltyAmount',
        },
      },
    });

    expect(result.output.totalPenalties).toEqual('6.00');
  });

  it('fixes the result with two decimal places', async () => {
    const result = await runAction(calculatePenaltiesAction, {
      props: {},
      state: {
        modal: {
          penalties: [
            {
              name: 'Penalty 1 (IRS)',
              penaltyAmount: '1',
              penaltyType:
                applicationContext.getConstants().PENALTY_TYPES
                  .IRS_PENALTY_AMOUNT,
            },
            {
              name: 'Penalty 2 (IRS)',
              penaltyAmount: '2',
              penaltyType:
                applicationContext.getConstants().PENALTY_TYPES
                  .IRS_PENALTY_AMOUNT,
            },
            {
              name: 'Penalty 3 (IRS)',
              penaltyAmount: '3.001',
              penaltyType:
                applicationContext.getConstants().PENALTY_TYPES
                  .IRS_PENALTY_AMOUNT,
            },
          ],
          subkey: 'irsPenaltyAmount',
        },
      },
    });

    expect(result.output.totalPenalties).toEqual('6.00');
  });

  it('handles stringified and numerical values', async () => {
    const result = await runAction(calculatePenaltiesAction, {
      props: {},
      state: {
        modal: {
          penalties: [
            {
              name: 'Penalty 1 (IRS)',
              penaltyAmount: '1',
              penaltyType:
                applicationContext.getConstants().PENALTY_TYPES
                  .IRS_PENALTY_AMOUNT,
            },
            {
              name: 'Penalty 2 (IRS)',
              penaltyAmount: '2',
              penaltyType:
                applicationContext.getConstants().PENALTY_TYPES
                  .IRS_PENALTY_AMOUNT,
            },
            {
              name: 'Penalty 3 (IRS)',
              penaltyAmount: '3',
              penaltyType:
                applicationContext.getConstants().PENALTY_TYPES
                  .IRS_PENALTY_AMOUNT,
            },
          ],
          subkey: 'irsPenaltyAmount',
        },
      },
    });

    expect(result.output.totalPenalties).toEqual('6.00');
  });

  it('should total only penalties that contain a penalty name', async () => {
    const result = await runAction(calculatePenaltiesAction, {
      props: {},
      state: {
        modal: {
          penalties: [
            {
              name: 'Penalty 1 (IRS)',
              penaltyAmount: '6',
              penaltyType:
                applicationContext.getConstants().PENALTY_TYPES
                  .IRS_PENALTY_AMOUNT,
            },
            { penaltyAmount: null },
            { penaltyAmount: '' },
          ],
          subkey: 'irsPenaltyAmount',
        },
      },
    });

    expect(result.output.totalPenalties).toEqual('6.00');
  });
});
