import { PENALTY_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setupItemizedPenaltiesModalStateAction } from './setupItemizedPenaltiesModalStateAction';

describe('setupItemizedPenaltiesModalStateAction', () => {
  const irsPenalty1 = {
    name: 'Penalty 1 (IRS)',
    penaltyAmount: 2000.15,
    penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
  };
  const irsPenalty2 = {
    name: 'Penalty 2 (IRS)',
    penaltyAmount: 0.0,
    penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
  };
  const courtDetermination1 = {
    name: 'Penalty 1 (USTC)',
    penaltyAmount: 0,
    penaltyType: PENALTY_TYPES.DETERMINATION_PENALTY_AMOUNT,
  };
  const courtDetermination2 = {
    name: 'Penalty 2 (USTC)',
    penaltyAmount: 200.77,
    penaltyType: PENALTY_TYPES.DETERMINATION_PENALTY_AMOUNT,
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('shouild set itemized penalties on state when both penalty types are equal in number', async () => {
    const result = await runAction(setupItemizedPenaltiesModalStateAction, {
      modules: {
        presenter,
      },
      props: {
        penalties: [
          irsPenalty1,
          courtDetermination1,
          irsPenalty2,
          courtDetermination2,
        ],
      },
      state: {},
    });

    expect(result.state.modal.itemizedPenalties).toEqual([
      {
        courtDeterminationAmount: courtDetermination1.penaltyAmount,
        irsPenaltyAmount: irsPenalty1.penaltyAmount,
      },
      {
        courtDeterminationAmount: courtDetermination2.penaltyAmount,
        irsPenaltyAmount: irsPenalty2.penaltyAmount,
      },
    ]);
  });

  // Where irs type penalties are greater in number
  // When there are no courtDetermination penalties
  // Where penalties on props is undefined or empty array
});
