import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
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
          penalties: [
            {
              name: 'Penalty 1 (IRS)',
              penaltyAmount: '100.00',
              penaltyType:
                applicationContext.getConstants().PENALTY_TYPES
                  .IRS_PENALTY_AMOUNT,
              statisticId: applicationContext.getUniqueId(),
            },
          ],
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
          penalties: [
            {
              name: 'Penalty 1 (IRS)',
              penaltyAmount: '37.00',
              penaltyType:
                applicationContext.getConstants().PENALTY_TYPES
                  .IRS_PENALTY_AMOUNT,
              statisticId: applicationContext.getUniqueId(),
            },
          ],
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
