import { deleteTrialSessionAction } from './deleteTrialSessionAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

let deleteTrialSessionMock;
const successMock = jest.fn();
const errorMock = jest.fn();

presenter.providers.path = {
  error: errorMock,
  success: successMock,
};

const trialSessionId = '18a1deae-30ee-4d5a-9107-0342a40c5333';

describe('deleteTrialSessionAction', () => {
  beforeEach(() => {
    deleteTrialSessionMock = jest.fn().mockResolvedValue({ trialSessionId });

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        deleteTrialSessionInteractor: deleteTrialSessionMock,
      }),
    };
  });

  it('goes to success path if trial session is deleted', async () => {
    await runAction(deleteTrialSessionAction, {
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
    deleteTrialSessionMock = jest.fn().mockRejectedValue(new Error('bad'));
    await runAction(deleteTrialSessionAction, {
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
