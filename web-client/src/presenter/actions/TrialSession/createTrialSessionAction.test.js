import { createTrialSessionAction } from './createTrialSessionAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

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

let createTrialSessionStub;
const setTrialSessionAsSwingSessionStub = sinon.stub();
const successStub = sinon.stub();
const errorStub = sinon.stub();

presenter.providers.path = {
  error: errorStub,
  success: successStub,
};

describe('createTrialSessionAction', () => {
  beforeEach(() => {
    createTrialSessionStub = sinon.stub().resolves(MOCK_TRIAL.trialSessionId);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        createTrialSession: createTrialSessionStub,
        setTrialSessionAsSwingSession: setTrialSessionAsSwingSessionStub,
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
    expect(successStub.calledOnce).toEqual(true);
  });

  it('goes to error path if error', async () => {
    createTrialSessionStub.throws('sadas');
    await runAction(createTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        form: { ...MOCK_TRIAL },
      },
    });
    expect(errorStub.calledOnce).toEqual(true);
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
    expect(createTrialSessionStub.called).toEqual(true);
    expect(setTrialSessionAsSwingSessionStub.called).toEqual(true);
    expect(setTrialSessionAsSwingSessionStub.getCall(0).args[0]).toMatchObject({
      swingSessionId: '123',
      trialSessionId: '456',
    });
  });
});
