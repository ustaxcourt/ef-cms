import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { calculatePenaltiesAction } from './calculatePenaltiesAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('calculatePenaltiesAction', () => {
  const statisticId = applicationContext.getUniqueId();
  const irsPenalty1 = {
    name: 'Penalty 1 (IRS)',
    penaltyAmount: '1.00',
    penaltyType:
      applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT,
  };
  const irsPenalty2 = {
    name: 'Penalty 2 (IRS)',
    penaltyAmount: '2.00',
    penaltyType:
      applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT,
  };
  const irsPenalty3 = {
    name: 'Penalty 3 (IRS)',
    penaltyAmount: '3.00',
    penaltyType:
      applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT,
  };

  const courtPenalty1 = {
    name: 'Penalty 1 (Court)',
    penaltyAmount: '3.00',
    penaltyType:
      applicationContext.getConstants().PENALTY_TYPES
        .DETERMINATION_PENALTY_AMOUNT,
  };

  describe('allPenalties', () => {
    it('aggregates the lists of penalties and excludedInitialPenalties', async () => {
      const result = await runAction(calculatePenaltiesAction, {
        state: {
          form: {
            statistics: [
              { penalties: [{}] },
              { penalties: [irsPenalty1, irsPenalty2, courtPenalty1] },
            ],
          },
          modal: {
            penalties: [irsPenalty1, irsPenalty2, irsPenalty3],
            statisticId,
            statisticIndex: 1,
            subkey:
              applicationContext.getConstants().PENALTY_TYPES
                .IRS_PENALTY_AMOUNT,
          },
        },
      });
      expect(result.output.allPenalties).toMatchObject([
        irsPenalty1,
        irsPenalty2,
        irsPenalty3,
        courtPenalty1,
      ]);
    });

    it('aggregates empty arrays and returns an empty array when statisticIndex is defined', async () => {
      const result = await runAction(calculatePenaltiesAction, {
        state: {
          form: {
            statistics: [{ penalties: [] }, { penalties: [] }],
          },
          modal: {
            penalties: [],
            statisticId,
            statisticIndex: 1,
            subkey:
              applicationContext.getConstants().PENALTY_TYPES
                .IRS_PENALTY_AMOUNT,
          },
        },
      });
      expect(result.output.allPenalties).toMatchObject([]);
    });

    it('aggregates empty arrays and returns an empty array when statisticIndex is defined and statistic on form is undefined', async () => {
      const result = await runAction(calculatePenaltiesAction, {
        state: {
          form: {
            statistics: undefined,
          },
          modal: {
            penalties: [],
            statisticId,
            statisticIndex: 1,
            subkey:
              applicationContext.getConstants().PENALTY_TYPES
                .IRS_PENALTY_AMOUNT,
          },
        },
      });
      expect(result.output.allPenalties).toMatchObject([]);
    });

    it('aggregates empty arrays and returns an empty array when statisticIndex is NOT defined', async () => {
      const result = await runAction(calculatePenaltiesAction, {
        state: {
          form: {},
          modal: {
            penalties: [],
            statisticId,
            subkey:
              applicationContext.getConstants().PENALTY_TYPES
                .IRS_PENALTY_AMOUNT,
          },
        },
      });
      expect(result.output.allPenalties).toMatchObject([]);
    });
  });

  describe('sumOfPenalties', () => {
    it('computes the sum of all penalties of IRS type', async () => {
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

      expect(result.output.sumOfPenalties).toEqual('6.00');
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

      expect(result.output.sumOfPenalties).toEqual('6.00');
    });
  });
});
