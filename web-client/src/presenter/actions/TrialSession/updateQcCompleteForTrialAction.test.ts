import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateQcCompleteForTrialAction } from './updateQcCompleteForTrialAction';

const successMock = jest.fn();
const errorMock = jest.fn();

describe('updateQcCompleteForTrialAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };

    applicationContext
      .getUseCases()
      .updateQcCompleteForTrialInteractor.mockResolvedValue(MOCK_CASE);
  });

  it('goes to success path if case is updated', async () => {
    await runAction(updateQcCompleteForTrialAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '123-20',
        qcCompleteForTrial: true,
      },
      state: {
        trialSession: {
          trialSessionId: 'cf4531f3-8f12-4cb3-8a24-9741e64a49fe',
        },
      },
    });
    expect(successMock).toHaveBeenCalled();
  });

  it('goes to error path if the use case throws an error', async () => {
    applicationContext
      .getUseCases()
      .updateQcCompleteForTrialInteractor.mockRejectedValueOnce(
        new Error('bad'),
      );
    await runAction(updateQcCompleteForTrialAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '123-20',
        qcCompleteForTrial: true,
      },
      state: {
        trialSession: {
          trialSessionId: 'cf4531f3-8f12-4cb3-8a24-9741e64a49fe',
        },
      },
    });
    expect(errorMock).toHaveBeenCalled();
  });
});
