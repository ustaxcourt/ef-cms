import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validatePenaltiesAction } from './validatePenaltiesAction';

describe('validatePenaltiesAction', () => {
  let successStub;
  let errorStub;

  const statisticId = applicationContext.getUniqueId();
  const validIrsPenalty1Mock = {
    name: 'Penalty 1 (IRS)',
    penaltyAmount: '1.00',
    penaltyType:
      applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT,
    statisticId,
  };
  const invalidIrsPenalty1Mock = {
    name: 'Penalty 1 (IRS)',
    penaltyAmount: '',
    penaltyType:
      applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT,
  };
  const validIrsPenalty2Mock = {
    name: 'Penalty 2 (IRS)',
    penaltyAmount: '2.00',
    penaltyType:
      applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT,
    statisticId,
  };

  const invalidIrsPenalty2Mock = {
    name: 'Penalty 2 (IRS)',
    penaltyAmount: '2.00',
    penaltyType: undefined,
  };

  const validCourtPenalty1Mock = {
    name: 'Penalty 1 (Court)',
    penaltyAmount: '3.00',
    penaltyType:
      applicationContext.getConstants().PENALTY_TYPES
        .DETERMINATION_PENALTY_AMOUNT,
    statisticId,
  };

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the error path when current penalties has a length less than 1', async () => {
    await runAction(validatePenaltiesAction, {
      modules: {
        presenter,
      },
      props: { allPenalties: [], itemizedPenaltiesOfCurrentType: [] },
      state: {},
    });

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub.mock.calls[0][0]).toEqual({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      error: {
        penaltyAmount: 'Please enter a penalty.',
      },
    });
  });

  it('should call the error path when allPenalties has penalties with validation errors', async () => {
    await runAction(validatePenaltiesAction, {
      modules: {
        presenter,
      },
      props: {
        allPenalties: [
          validCourtPenalty1Mock,
          invalidIrsPenalty1Mock,
          invalidIrsPenalty2Mock,
        ],
        itemizedPenaltiesOfCurrentType: [validCourtPenalty1Mock],
      },
      state: {},
    });

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub.mock.calls[0][0]).toEqual({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      error: {
        penaltyAmount: 'Enter penalty amount.',
        penaltyType: 'Penalty type is required.',
        statisticId: 'Statistic ID is required.',
      },
    });
  });

  it('should call the success path when there are no errors in the errors object', async () => {
    const props = {
      allPenalties: [
        validCourtPenalty1Mock,
        validIrsPenalty1Mock,
        validIrsPenalty2Mock,
      ],
      itemizedPenaltiesOfCurrentType: [
        validIrsPenalty1Mock,
        validIrsPenalty2Mock,
      ],
    };

    await runAction(validatePenaltiesAction, {
      modules: {
        presenter,
      },
      props,
      state: {},
    });

    expect(successStub).toHaveBeenCalled();
    expect(successStub.mock.calls[0][0]).toEqual(props);
  });
});
