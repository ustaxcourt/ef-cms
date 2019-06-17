import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateTrialSessionAction } from './validateTrialSessionAction';
import sinon from 'sinon';

presenter.providers.applicationContext = {
  getUseCases: () => ({
    validateTrialSession: () => 'hello from validate trial session',
  }),
};

const MOCK_TRIAL = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2019-12-01T00:00:00.000Z',
  term: 'Fall',
  trialLocation: 'Birmingham, AL',
};

describe('validateTrialSessionAction', () => {
  let validateTrialSessionStub;
  let successStub;
  let errorStub;

  beforeEach(() => {
    validateTrialSessionStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateTrialSession: validateTrialSessionStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the path success when no errors are found', async () => {
    validateTrialSessionStub.returns(null);
    await runAction(validateTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        form: MOCK_TRIAL,
      },
    });

    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the path error when any errors are found', async () => {
    validateTrialSessionStub.returns('error');
    await runAction(validateTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        form: MOCK_TRIAL,
      },
    });

    expect(errorStub.calledOnce).toEqual(true);
  });

  it('should call the path error when term is summer', async () => {
    validateTrialSessionStub.returns('error');
    await runAction(validateTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        form: { ...MOCK_TRIAL, term: 'Summer' },
      },
    });

    expect(errorStub.calledOnce).toEqual(true);
  });
});
