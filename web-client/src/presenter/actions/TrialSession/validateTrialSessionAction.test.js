import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateTrialSessionAction } from './validateTrialSessionAction';
import sinon from 'sinon';

presenter.providers.applicationContext = {
  getUseCases: () => ({
    validateTrialSessionInteractor: () => 'hello from validate trial session',
  }),
};

const MOCK_TRIAL = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2019-12-01T00:00:00.000Z',
  term: 'Fall',
  trialLocation: 'Birmingham, Alabama',
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
        validateTrialSessionInteractor: validateTrialSessionStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
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

  it('should call the error path when any errors are found', async () => {
    validateTrialSessionStub.returns({ some: 'error' });
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

  it('should call the error path when term is summer', async () => {
    validateTrialSessionStub.returns({ term: 'error' });
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
