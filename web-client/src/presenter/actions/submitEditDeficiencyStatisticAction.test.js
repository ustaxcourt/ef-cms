import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitEditDeficiencyStatisticAction } from './submitEditDeficiencyStatisticAction';

presenter.providers.applicationContext = applicationContext;
presenter.providers.path = {
  error: jest.fn(),
  success: jest.fn(),
};

describe('submitEditDeficiencyStatisticAction', () => {
  it('calls the deficiency statistics update interactor, returning the success path', async () => {
    const statistic = {
      determinationDeficiencyAmount: '1',
      determinationTotalPenalties: '2',
      irsDeficiencyAmount: '3',
      irsTotalPenalties: '4',
      lastDateOfPeriod: null,
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
      lastDateOfPeriodDay: '01',
      lastDateOfPeriodMonth: '03',
      lastDateOfPeriodYear: '2019',
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
    presenter.providers.applicationContext
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
