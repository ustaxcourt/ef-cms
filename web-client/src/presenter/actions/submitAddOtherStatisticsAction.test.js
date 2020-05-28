import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitAddOtherStatisticsAction } from './submitAddOtherStatisticsAction';

presenter.providers.applicationContext = applicationContext;
presenter.providers.path = {
  error: jest.fn(),
  success: jest.fn(),
};

describe('submitAddOtherStatisticsAction', () => {
  it('calls the other statistics submit interactor, returning the success path', async () => {
    await runAction(submitAddOtherStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: '123',
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

  it('returns the error path if an error is encountered when calling the interactor', async () => {
    presenter.providers.applicationContext
      .getUseCases()
      .updateOtherStatisticsInteractor.mockImplementationOnce(() => {
        throw new Error('error');
      });

    await runAction(submitAddOtherStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: '123',
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
        title: 'Errors were found. Please correct your form and resubmit.',
      },
    });
  });
});
