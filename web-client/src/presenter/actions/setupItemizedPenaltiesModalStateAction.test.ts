import { PENALTY_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
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
    name: 'Penalty 1 (Court)',
    penaltyAmount: 0.0,
    penaltyType: PENALTY_TYPES.DETERMINATION_PENALTY_AMOUNT,
  };
  const courtDetermination2 = {
    name: 'Penalty 2 (Court)',
    penaltyAmount: 200.77,
    penaltyType: PENALTY_TYPES.DETERMINATION_PENALTY_AMOUNT,
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set itemized penalties on state when both penalty types are equal in number', async () => {
    const result = await runAction(setupItemizedPenaltiesModalStateAction, {
      modules: {
        presenter,
      },
      props: {
        determinationTotalPenalties: 0.0,
        irsTotalPenalties: 2000.15,
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
        determinationPenaltyAmount: '$0.00',
        irsPenaltyAmount: '$2,000.15',
      },
      {
        determinationPenaltyAmount: '$200.77',
        irsPenaltyAmount: '$0.00',
      },
    ]);
  });

  it('should set itemized penalties on state when irs type penalties are greater in number', async () => {
    const result = await runAction(setupItemizedPenaltiesModalStateAction, {
      modules: {
        presenter,
      },
      props: {
        determinationTotalPenalties: '$0.00',
        irsTotalPenalties: '$2,000.15',
        penalties: [irsPenalty1, courtDetermination1, irsPenalty2],
      },
      state: {},
    });

    expect(result.state.modal.itemizedPenalties).toEqual([
      {
        determinationPenaltyAmount: '$0.00',
        irsPenaltyAmount: '$2,000.15',
      },
      {
        irsPenaltyAmount: '$0.00',
      },
    ]);
  });

  it('should set itemized penalties on state when court determination type penalties are greater in number', async () => {
    const result = await runAction(setupItemizedPenaltiesModalStateAction, {
      modules: {
        presenter,
      },
      props: {
        determinationTotalPenalties: '$0.00',
        irsTotalPenalties: '$2,000.15',
        penalties: [irsPenalty1, courtDetermination1, courtDetermination2],
      },
      state: {},
    });

    expect(result.state.modal.itemizedPenalties).toEqual([
      {
        determinationPenaltyAmount: '$0.00',
        irsPenaltyAmount: '$2,000.15',
      },
      {
        determinationPenaltyAmount: '$200.77',
      },
    ]);
  });

  it('should set itemized penalties on state when there are no courtDetermination penalties', async () => {
    const result = await runAction(setupItemizedPenaltiesModalStateAction, {
      modules: {
        presenter,
      },
      props: {
        determinationTotalPenalties: '',
        irsTotalPenalties: '$2,000.15',
        penalties: [irsPenalty1, irsPenalty2],
      },
      state: {},
    });

    expect(result.state.modal.itemizedPenalties).toEqual([
      {
        irsPenaltyAmount: '$2,000.15',
      },
      {
        irsPenaltyAmount: '$0.00',
      },
    ]);
  });

  it('should set itemized penalties on state when penalties is an empty array', async () => {
    const result = await runAction(setupItemizedPenaltiesModalStateAction, {
      modules: {
        presenter,
      },
      props: {
        determinationTotalPenalties: '',
        irsTotalPenalties: '',
        penalties: [],
      },
      state: {},
    });

    expect(result.state.modal.itemizedPenalties).toEqual([]);
  });
});
