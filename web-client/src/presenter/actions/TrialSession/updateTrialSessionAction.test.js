import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { updateTrialSessionAction } from './updateTrialSessionAction';

describe('updateTrialSessionAction', () => {
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

  const successMock = jest.fn();
  const errorMock = jest.fn();

  presenter.providers.path = {
    error: errorMock,
    success: successMock,
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .updateTrialSessionInteractor.mockResolvedValue(MOCK_TRIAL);
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

    expect(
      applicationContext.getUseCases().updateTrialSessionInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().setTrialSessionAsSwingSessionInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().setTrialSessionAsSwingSessionInteractor
        .mock.calls[0][1],
    ).toMatchObject({
      swingSessionId: '123',
      trialSessionId: '456',
    });
  });

  it('goes to error path if error', async () => {
    applicationContext
      .getUseCases()
      .updateTrialSessionInteractor.mockRejectedValue(new Error('bad'));

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
