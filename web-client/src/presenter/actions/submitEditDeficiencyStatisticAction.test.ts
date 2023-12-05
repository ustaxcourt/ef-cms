import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitEditDeficiencyStatisticAction } from './submitEditDeficiencyStatisticAction';

describe('submitEditDeficiencyStatisticAction', () => {
  presenter.providers.applicationContext = applicationContext;

  presenter.providers.path = {
    error: jest.fn(),
    success: jest.fn(),
  };

  it('calls the deficiency statistics update interactor, returning the success path', async () => {
    const statistic = {
      determinationDeficiencyAmount: '1',
      determinationTotalPenalties: '2',
      irsDeficiencyAmount: '3',
      irsTotalPenalties: '4',
      lastDateOfPeriod: null,
      penalties: [
        {
          name: 'Penalty 1 (IRS)',
          penaltyAmount: '100.00',
          penaltyType:
            applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT,
          statisticId: applicationContext.getUniqueId(),
        },
      ],
      year: '2019',
      yearOrPeriod: 'Year',
    };

    await runAction(submitEditDeficiencyStatisticAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
          statistics: [statistic],
        },
        form: { ...statistic, statisticIndex: 0, year: 2012 },
      },
    });

    expect(
      applicationContext.getUseCases().updateDeficiencyStatisticInteractor,
    ).toHaveBeenCalled();
    expect(presenter.providers.path.success).toHaveBeenCalledWith({
      alertSuccess: { message: '2012 statistics updated.' },
    });
  });

  it('calls the deficiency statistics update interactor, returning the success path with a lastDateOfPeriod success message', async () => {
    const statistic = {
      determinationDeficiencyAmount: '1',
      determinationTotalPenalties: '2',
      irsDeficiencyAmount: '3',
      irsTotalPenalties: '4',
      lastDateOfPeriod: '2019-03-01T21:40:46.415Z',
      penalties: [
        {
          name: 'Penalty 1 (IRS)',
          penaltyAmount: '50.00',
          penaltyType:
            applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT,
          statisticId: applicationContext.getUniqueId(),
        },
      ],
      year: null,
      yearOrPeriod: 'Period',
    };

    await runAction(submitEditDeficiencyStatisticAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
          statistics: [statistic],
        },
        form: { ...statistic, irsTotalPenalties: 5, statisticIndex: 0 },
      },
    });

    expect(
      applicationContext.getUseCases().updateDeficiencyStatisticInteractor,
    ).toHaveBeenCalled();
    expect(presenter.providers.path.success).toHaveBeenCalledWith({
      alertSuccess: { message: '03/01/19 statistics updated.' },
    });
  });

  it('returns the error path if an error is encountered when calling the interactor', async () => {
    applicationContext
      .getUseCases()
      .updateDeficiencyStatisticInteractor.mockImplementationOnce(() => {
        throw new Error('error');
      });

    const statistic = {
      determinationDeficiencyAmount: '1',
      determinationTotalPenalties: '2',
      irsDeficiencyAmount: '3',
      irsTotalPenalties: '4',
      lastDateOfPeriod: null,
      penalites: [
        {
          name: 'Penalty 1 (IRS)',
          penaltyAmount: '75.00',
          penaltyType:
            applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT,
          statisticId: applicationContext.getUniqueId(),
        },
      ],
      year: '2019',
      yearOrPeriod: 'Year',
    };

    await runAction(submitEditDeficiencyStatisticAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
          statistics: [statistic],
        },
        form: { ...statistic, statisticIndex: 0 },
      },
    });

    expect(presenter.providers.path.success).not.toHaveBeenCalled();
    expect(presenter.providers.path.error).toHaveBeenCalledWith({
      alertError: {
        message: 'Please try again.',
        title: 'Statistic could not be edited.',
      },
    });
  });
});
