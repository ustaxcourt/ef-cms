import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { deleteDeficiencyStatisticsAction } from './deleteDeficiencyStatisticsAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;
presenter.providers.path = {
  error: jest.fn(),
  success: jest.fn(),
};

describe('deleteDeficiencyStatisticsAction', () => {
  it('calls the deficiency statistics delete interactor, returning the success path', async () => {
    const statistic = {
      determinationDeficiencyAmount: '1',
      determinationTotalPenalties: '2',
      irsDeficiencyAmount: '3',
      irsTotalPenalties: '4',
      lastDateOfPeriod: null,
      statisticId: '3c4a440d-00c9-458d-a113-23cc833e09c5',
      year: '2019',
      yearOrPeriod: 'Year',
    };

    await runAction(deleteDeficiencyStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
          statistics: [statistic],
        },
        form: { ...statistic },
      },
    });

    expect(
      applicationContext.getUseCases().deleteDeficiencyStatisticInteractor,
    ).toHaveBeenCalled();
    expect(presenter.providers.path.success).toHaveBeenCalledWith({
      alertSuccess: { message: '2019 statistics deleted.' },
    });
  });

  it('calls the deficiency statistics delete interactor, returning the success path with a lastDateOfPeriod success message', async () => {
    const statistic = {
      determinationDeficiencyAmount: '1',
      determinationTotalPenalties: '2',
      irsDeficiencyAmount: '3',
      irsTotalPenalties: '4',
      lastDateOfPeriod: '2019-03-01T21:40:46.415Z',
      statisticId: '3c4a440d-00c9-458d-a113-23cc833e09c5',
      year: null,
      yearOrPeriod: 'Period',
    };

    await runAction(deleteDeficiencyStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
          statistics: [statistic],
        },
        form: { ...statistic },
      },
    });

    expect(
      applicationContext.getUseCases().deleteDeficiencyStatisticInteractor,
    ).toHaveBeenCalled();
    expect(presenter.providers.path.success).toHaveBeenCalledWith({
      alertSuccess: { message: '03/01/19 statistics deleted.' },
    });
  });

  it('returns the error path if an error is encountered when calling the interactor', async () => {
    presenter.providers.applicationContext
      .getUseCases()
      .deleteDeficiencyStatisticInteractor.mockImplementationOnce(() => {
        throw new Error('error');
      });

    const statistic = {
      determinationDeficiencyAmount: '1',
      determinationTotalPenalties: '2',
      irsDeficiencyAmount: '3',
      irsTotalPenalties: '4',
      lastDateOfPeriod: null,
      statisticId: '3c4a440d-00c9-458d-a113-23cc833e09c5',
      year: '2019',
      yearOrPeriod: 'Year',
    };

    await runAction(deleteDeficiencyStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
          statistics: [statistic],
        },
        form: { ...statistic },
      },
    });

    expect(presenter.providers.path.success).not.toHaveBeenCalled();
    expect(presenter.providers.path.error).toHaveBeenCalledWith({
      alertError: {
        message: 'Please try again.',
        title: 'Statistic could not be deleted.',
      },
    });
  });
});
