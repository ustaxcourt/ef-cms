import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitAddDeficiencyStatisticsAction } from './submitAddDeficiencyStatisticsAction';

presenter.providers.applicationContext = applicationContext;
presenter.providers.path = {
  error: jest.fn(),
  success: jest.fn(),
};

describe('submitAddDeficiencyStatisticsAction', () => {
  it('calls the deficiency statistics submit interactor, returning the success path', async () => {
    await runAction(submitAddDeficiencyStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
        form: {
          determinationDeficiencyAmount: '1',
          determinationTotalPenalties: '2',
          irsDeficiencyAmount: '3',
          irsTotalPenalties: '4',
          lastDateOfPeriod: null,
          year: '2019',
          yearOrPeriod: 'Year',
        },
      },
    });

    expect(
      applicationContext.getUseCases().addDeficiencyStatisticInteractor,
    ).toHaveBeenCalled();
    expect(presenter.providers.path.success).toHaveBeenCalledWith({
      alertSuccess: { message: 'Year/Period added.' },
    });
  });

  it('returns the error path if an error is encountered when calling the interactor', async () => {
    presenter.providers.applicationContext
      .getUseCases()
      .addDeficiencyStatisticInteractor.mockImplementationOnce(() => {
        throw new Error('error');
      });

    await runAction(submitAddDeficiencyStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
        form: {
          determinationDeficiencyAmount: '1',
          determinationTotalPenalties: '2',
          irsDeficiencyAmount: '3',
          irsTotalPenalties: '4',
          lastDateOfPeriod: null,
          year: '2019',
          yearOrPeriod: 'Year',
        },
      },
    });

    expect(presenter.providers.path.success).not.toHaveBeenCalled();
    expect(presenter.providers.path.error).toHaveBeenCalledWith({
      alertError: {
        message: 'Please try again.',
        title: 'Statistic could not be added.',
      },
    });
  });
});
