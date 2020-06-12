import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { deleteOtherStatisticsAction } from './deleteOtherStatisticsAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('deleteOtherStatisticsAction', () => {
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

    await runAction(deleteOtherStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: '101-19',
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

    await runAction(deleteOtherStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: '101-19',
        },
      },
    });

    expect(presenter.providers.path.error).toBeCalled();
  });
});
