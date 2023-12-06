import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createTrialSessionAction } from './createTrialSessionAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('createTrialSessionAction', () => {
  const MOCK_TRIAL = {
    maxCases: 100,
    sessionType: 'Regular',
    startDate: '2019-12-01T00:00:00.000Z',
    term: 'Fall',
    trialLocation: 'Birmingham, Alabama',
    trialSessionId: '123',
  };

  const successStub = jest.fn();
  const errorStub = jest.fn();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .createTrialSessionInteractor.mockResolvedValue(MOCK_TRIAL);
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
    applicationContext
      .getUseCases()
      .createTrialSessionInteractor.mockImplementation(() => {
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
});
