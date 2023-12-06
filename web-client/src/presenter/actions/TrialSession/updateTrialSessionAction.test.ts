import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateTrialSessionAction } from './updateTrialSessionAction';

describe('updateTrialSessionAction', () => {
  const mockPdfUrl = 'a url';
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
      .updateTrialSessionInteractor.mockResolvedValue({
        newTrialSession: MOCK_TRIAL,
      });
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

  it('goes to error path if error', async () => {
    applicationContext
      .getUseCases()
      .updateTrialSessionInteractor.mockRejectedValueOnce(new Error('bad'));

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

  it('returns the paper service pdfUrl and trialSessionId as props if one is present', async () => {
    applicationContext
      .getUseCases()
      .updateTrialSessionInteractor.mockResolvedValue({
        newTrialSession: MOCK_TRIAL,
        serviceInfo: mockPdfUrl,
      });

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
});
