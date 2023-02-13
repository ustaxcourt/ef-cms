import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
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

  it('removes the estimatedEndDateMonth, Day, Year from the trialSession', async () => {
    await runAction(updateTrialSessionAction, {
      modules: {
        presenter,
      },
      props: {
        computedEstimatedEndDate: '2020-12-01T00:00:00.000Z',
        computedStartDate: '2019-12-01T00:00:00.000Z',
      },
      state: {
        form: {
          ...MOCK_TRIAL,
          estimatedEndDateDay: '02',
          estimatedEndDateMonth: '01',
          estimatedEndDateYear: '2002',
          startDateDay: '04',
          startDateMonth: '04',
          startDateYear: '2000',
        },
      },
    });
    const sentTrialSession =
      applicationContext.getUseCases().updateTrialSessionInteractor.mock
        .calls[0][1].trialSession;

    expect(sentTrialSession.estimatedEndDateDay).not.toBeDefined();
    expect(sentTrialSession.estimatedEndDateMonth).not.toBeDefined();
    expect(sentTrialSession.estimatedEndDateYear).not.toBeDefined();
    expect(sentTrialSession.startDateDay).not.toBeDefined();
    expect(sentTrialSession.startDateMonth).not.toBeDefined();
    expect(sentTrialSession.startDateYear).not.toBeDefined();
    expect(sentTrialSession).toMatchObject({
      estimatedEndDate: '2020-12-01T00:00:00.000Z',
      startDate: '2019-12-01T00:00:00.000Z',
    });
  });
});
