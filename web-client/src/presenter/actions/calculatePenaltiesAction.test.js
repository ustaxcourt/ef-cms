import { calculatePenaltiesAction } from './calculatePenaltiesAction';
import { runAction } from 'cerebral/test';

describe('calculatePenaltiesAction', () => {
  it('computes the total of all penalties', async () => {
    const result = await runAction(calculatePenaltiesAction, {
      props: {},
      state: {
        modal: {
          penalties: [
            { irsPenaltyAmount: '1.00', name: 'Penalty1' },
            { irsPenaltyAmount: '2.00', name: 'Penalty2' },
            { irsPenaltyAmount: '3.00', name: 'Penalty3' },
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
            { irsPenaltyAmount: '1', name: 'Penalty1' },
            { irsPenaltyAmount: '2', name: 'Penalty2' },
            { irsPenaltyAmount: '3.001', name: 'Penalty3' },
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
            { irsPenaltyAmount: '1', name: 'Penalty1' },
            { irsPenaltyAmount: '2', name: 'Penalty2' },
            { irsPenaltyAmount: '3', name: 'Penalty3' },
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
            { irsPenaltyAmount: '6', name: 'Penalty1' },
            { irsPenaltyAmount: null },
            { irsPenaltyAmount: '' },
          ],
          subkey: 'irsPenaltyAmount',
        },
      },
    });

    expect(result.output.totalPenalties).toEqual('6.00');
  });
});
