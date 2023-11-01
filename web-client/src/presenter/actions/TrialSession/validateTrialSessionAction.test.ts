import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateTrialSessionAction } from './validateTrialSessionAction';

describe('validateTrialSessionAction', () => {
  let successStub;
  let errorStub;

  const MOCK_TRIAL = {
    maxCases: 100,
    sessionType: 'Regular',
    startDate: '2019-12-01T00:00:00.000Z',
    term: 'Fall',
    trialLocation: 'Birmingham, Alabama',
  };

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };

    applicationContext
      .getUseCases()
      .validateTrialSessionInteractor.mockReturnValue(
        'hello from validate trial session',
      );
  });

  it('should call the success path when no errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateTrialSessionInteractor.mockReturnValue(null);
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
    applicationContext
      .getUseCases()
      .validateTrialSessionInteractor.mockReturnValue({ some: 'error' });
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
    applicationContext
      .getUseCases()
      .validateTrialSessionInteractor.mockReturnValue({ term: 'error' });
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

  it('should consider the form valid with valid data', async () => {
    applicationContext
      .getUseCases()
      .validateTrialSessionInteractor.mockReturnValue(null);

    await runAction(validateTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          ...MOCK_TRIAL,
          estimatedEndDate: '3050-01-02',
          startDate: '2020-04-04',
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
  });
});
