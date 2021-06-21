import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext.js';
import { createTrialSessionAction } from './createTrialSessionAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

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

  it('calls setTrialSessionAsSwingSession if swingSession is true and swingSessionId is set', async () => {
    await runAction(createTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          ...MOCK_TRIAL,
          swingSession: true,
          swingSessionId: '456',
        },
      },
    });
    expect(
      applicationContext.getUseCases().createTrialSessionInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getUseCases().setTrialSessionAsSwingSessionInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getUseCases().setTrialSessionAsSwingSessionInteractor
        .mock.calls[0][1],
    ).toMatchObject({
      swingSessionId: '123',
      trialSessionId: '456',
    });
  });
});
