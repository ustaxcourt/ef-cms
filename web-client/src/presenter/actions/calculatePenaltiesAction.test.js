import { calculatePenaltiesAction } from './calculatePenaltiesAction';
import { runAction } from 'cerebral/test';

describe('calculatePenaltiesAction', () => {
  it('computes the total of all penalties', async () => {
    const result = await runAction(calculatePenaltiesAction, {
      props: {},
      state: {
        modal: {
          penalties: [
            { irsPenaltyAmount: '1.00' },
            { irsPenaltyAmount: '2.00' },
            { irsPenaltyAmount: '3.00' },
          ],
        },
      },
    });

    expect(result.output.totalPenalties).toEqual('$6.00');
  });

  it('fixes the result with two decimal places', async () => {
    const result = await runAction(calculatePenaltiesAction, {
      props: {},
      state: {
        modal: {
          penalties: [
            { irsPenaltyAmount: '1' },
            { irsPenaltyAmount: '2' },
            { irsPenaltyAmount: '3.001' },
          ],
        },
      },
    });

    expect(result.output.totalPenalties).toEqual('$6.00');
  });

  it('handles stringified and numerical values', async () => {
    const result = await runAction(calculatePenaltiesAction, {
      props: {},
      state: {
        modal: {
          penalties: [
            { irsPenaltyAmount: '1' },
            { irsPenaltyAmount: '2' },
            { irsPenaltyAmount: '3' },
          ],
        },
      },
    });

    expect(result.output.totalPenalties).toEqual('$6.00');
  });

  it('coerces empty string and null values to 0', async () => {
    const result = await runAction(calculatePenaltiesAction, {
      props: {},
      state: {
        modal: {
          penalties: [
            { irsPenaltyAmount: '6' },
            { irsPenaltyAmount: null },
            { irsPenaltyAmount: '' },
          ],
        },
      },
    });

    expect(result.output.totalPenalties).toEqual('$6.00');
  });
});
