import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitOtherStatisticsAction } from './submitOtherStatisticsAction';

presenter.providers.applicationContext = applicationContext;
presenter.providers.path = {
  error: jest.fn(),
  success: jest.fn(),
};

describe('submitOtherStatisticsAction', () => {
  it('calls the other statistics submit interactor, returning the success path', async () => {
    await runAction(submitOtherStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-19',
        },
        form: {
          damages: '1',
          litigationCosts: '5',
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateOtherStatisticsInteractor,
    ).toHaveBeenCalled();
    expect(presenter.providers.path.success).toHaveBeenCalledWith({
      alertSuccess: { message: 'Other statistics added.' },
    });
  });

  it('calls the other statistics submit interactor, returning the success path with the isEditing success message', async () => {
    await runAction(submitOtherStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-19',
        },
        form: {
          damages: '1',
          isEditing: true,
          litigationCosts: '5',
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateOtherStatisticsInteractor,
    ).toHaveBeenCalled();
    expect(presenter.providers.path.success).toHaveBeenCalledWith({
      alertSuccess: { message: 'Other statistics updated.' },
    });
  });

  it('returns the error path if an error is encountered when calling the interactor when adding a new other statistic', async () => {
    presenter.providers.applicationContext
      .getUseCases()
      .updateOtherStatisticsInteractor.mockImplementationOnce(() => {
        throw new Error('error');
      });

    await runAction(submitOtherStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-19',
        },
        form: {
          damages: '1',
          litigationCosts: '5',
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

  it('returns the error path if an error is encountered when calling the interactor when editing an other statistic', async () => {
    presenter.providers.applicationContext
      .getUseCases()
      .updateOtherStatisticsInteractor.mockImplementationOnce(() => {
        throw new Error('error');
      });

    await runAction(submitOtherStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-19',
        },
        form: {
          damages: '1',
          isEditing: true,
          litigationCosts: '5',
        },
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
