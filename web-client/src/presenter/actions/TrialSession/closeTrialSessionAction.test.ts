import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { closeTrialSessionAction } from './closeTrialSessionAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

const successMock = jest.fn();
const errorMock = jest.fn();

presenter.providers.path = {
  error: errorMock,
  success: successMock,
};

const trialSessionId = '18a1deae-30ee-4d5a-9107-0342a40c5333';

describe('closeTrialSessionAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .closeTrialSessionInteractor.mockResolvedValue({ trialSessionId });
  });

  it('goes to success path if trial session is closed', async () => {
    await runAction(closeTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        trialSessionId,
      },
    });
    expect(successMock).toHaveBeenCalled();
  });

  it('goes to error path if error', async () => {
    applicationContext.getUseCases().closeTrialSessionInteractor = jest
      .fn()
      .mockRejectedValueOnce(new Error('bad'));

    await runAction(closeTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        trialSessionId,
      },
    });

    expect(errorMock).toHaveBeenCalled();
  });
});
