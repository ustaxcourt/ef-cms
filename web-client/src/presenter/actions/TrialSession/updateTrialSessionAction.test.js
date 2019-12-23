import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateTrialSessionAction } from './updateTrialSessionAction';

const MOCK_TRIAL = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2019-12-01T00:00:00.000Z',
  swingSession: true,
  swingSessionId: '456',
  term: 'Fall',
  trialLocation: 'Birmingham, AL',
  trialSessionId: '123',
};

let updateTrialSessionMock;
const setTrialSessionAsSwingSessionMock = jest.fn();
const successMock = jest.fn();
const errorMock = jest.fn();

presenter.providers.path = {
  error: errorMock,
  success: successMock,
};

describe('updateTrialSessionAction', () => {
  beforeEach(() => {
    updateTrialSessionMock = jest.fn().mockResolvedValue(MOCK_TRIAL);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        setTrialSessionAsSwingSessionInteractor: setTrialSessionAsSwingSessionMock,
        updateTrialSessionInteractor: updateTrialSessionMock,
      }),
    };
  });

  it('goes to success path if trial session is updated', async () => {
    await runAction(updateTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        form: { ...MOCK_TRIAL },
      },
    });
    expect(successMock).toHaveBeenCalled();
  });

  it('calls setTrialSessionAsSwingSession if swingSession is true and swingSessionId is set', async () => {
    await runAction(updateTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        form: { ...MOCK_TRIAL },
      },
    });
    expect(updateTrialSessionMock).toHaveBeenCalled();
    expect(setTrialSessionAsSwingSessionMock).toHaveBeenCalled();
    expect(setTrialSessionAsSwingSessionMock.mock.calls[0][0]).toMatchObject({
      swingSessionId: '123',
      trialSessionId: '456',
    });
  });

  it('goes to error path if error', async () => {
    updateTrialSessionMock = jest.fn().mockRejectedValue(new Error('bad'));
    await runAction(updateTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        form: { ...MOCK_TRIAL },
      },
    });
    expect(errorMock).toHaveBeenCalled();
  });
});
