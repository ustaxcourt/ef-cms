import { calculatePenaltiesAction } from './calculatePenaltiesAction';
import { runAction } from 'cerebral/test';

describe('calculatePenaltiesAction', () => {
  it('computes the total of all penalties', async () => {
    const result = await runAction(calculatePenaltiesAction, {
      props: {},
      state: {
        modal: {
          penalties: ['1.00', '2.00', '3.00'],
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
          penalties: ['1', '2', '3.001'],
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
          penalties: ['1', 2, '3'],
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
          penalties: ['6', null, ''],
        },
      },
    });

    expect(result.output.totalPenalties).toEqual('$6.00');
  });
});
