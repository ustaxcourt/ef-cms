import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateTrialSessionAction } from './validateTrialSessionAction';

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
    validateTrialSessionStub = jest.fn();
    successStub = jest.fn();
    errorStub = jest.fn();

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
    validateTrialSessionStub = jest.fn().mockReturnValue(null);
    await runAction(validateTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        form: MOCK_TRIAL,
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    validateTrialSessionStub = jest.fn().mockReturnValue({ some: 'error' });
    await runAction(validateTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        form: MOCK_TRIAL,
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when term is summer', async () => {
    validateTrialSessionStub = jest.fn().mockReturnValue({ term: 'error' });
    await runAction(validateTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        form: { ...MOCK_TRIAL, term: 'Summer' },
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
