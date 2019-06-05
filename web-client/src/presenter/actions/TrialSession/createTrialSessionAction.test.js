import { createTrialSessionAction } from './createTrialSessionAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

const createTrialSessionStub = sinon.stub();
const successStub = sinon.stub();
const errorStub = sinon.stub();

presenter.providers.applicationContext = {
  getUseCases: () => ({
    createTrialSession: createTrialSessionStub,
  }),
};

presenter.providers.path = {
  error: errorStub,
  success: successStub,
};

const MOCK_TRIAL = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2019-12-01T00:00:00.000Z',
  term: 'Fall',
  trialLocation: 'Birmingham, AL',
};

describe('createTrialSessionAction', () => {
  it('goes to success path if trial session is created', async () => {
    createTrialSessionStub.returns(MOCK_TRIAL);
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
});
