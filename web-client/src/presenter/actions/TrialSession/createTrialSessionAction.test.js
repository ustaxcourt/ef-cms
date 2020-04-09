import { createTrialSessionAction } from './createTrialSessionAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

const MOCK_TRIAL = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2019-12-01T00:00:00.000Z',
  swingSession: true,
  swingSessionId: '456',
  term: 'Fall',
  trialLocation: 'Birmingham, Alabama',
  trialSessionId: '123',
};

let createTrialSessionStub;
const setTrialSessionAsSwingSessionStub = jest.fn();
const successStub = jest.fn();
const errorStub = jest.fn();

presenter.providers.path = {
  error: errorStub,
  success: successStub,
};

describe('createTrialSessionAction', () => {
  beforeEach(() => {
    createTrialSessionStub = jest.fn().mockResolvedValue(MOCK_TRIAL);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        createTrialSessionInteractor: createTrialSessionStub,
        setTrialSessionAsSwingSessionInteractor: setTrialSessionAsSwingSessionStub,
      }),
    };
  });

  it('goes to success path if trial session is created', async () => {
    await runAction(createTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        form: { ...MOCK_TRIAL },
      },
    });
    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('goes to error path if error', async () => {
    createTrialSessionStub = jest.fn().mockImplementation(() => {
      throw new Error('sadas');
    });
    await runAction(createTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        form: { ...MOCK_TRIAL },
      },
    });
    expect(errorStub.mock.calls.length).toEqual(1);
  });

  it('calls setTrialSessionAsSwingSession if swingSession is true and swingSessionId is set', async () => {
    await runAction(createTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        form: { ...MOCK_TRIAL },
      },
    });
    expect(createTrialSessionStub).toBeCalled();
    expect(setTrialSessionAsSwingSessionStub).toBeCalled();
    expect(setTrialSessionAsSwingSessionStub.mock.calls[0][0]).toMatchObject({
      swingSessionId: '123',
      trialSessionId: '456',
    });
  });
});
