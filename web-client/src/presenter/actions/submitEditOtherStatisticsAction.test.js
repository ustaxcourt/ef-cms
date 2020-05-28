import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitEditOtherStatisticsAction } from './submitEditOtherStatisticsAction';

describe('submitEditOtherStatisticsAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: jest.fn(),
      success: jest.fn(),
    };
  });

  it('should take the success path if no errors are found', async () => {
    applicationContext
      .getUseCases()
      .updateOtherStatisticsInteractor.mockResolvedValue(null);

    await runAction(submitEditOtherStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
        form: {
          damages: 1,
          litigationCosts: 1,
        },
      },
    });

    expect(presenter.providers.path.success).toBeCalled();
  });

  it('should take the error path if no errors are found', async () => {
    applicationContext
      .getUseCases()
      .updateOtherStatisticsInteractor.mockImplementation(() => {
        throw new Error();
      });

    await runAction(submitEditOtherStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: '101-19',
        },
        form: {
          damages: 1,
          litigationCosts: 1,
        },
      },
    });

    expect(presenter.providers.path.error).toBeCalled();
  });
});
