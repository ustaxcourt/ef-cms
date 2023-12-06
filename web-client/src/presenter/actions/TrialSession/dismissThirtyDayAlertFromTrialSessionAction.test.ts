import { MOCK_TRIAL_REGULAR } from '../../../../../shared/src/test/mockTrial';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { dismissThirtyDayAlertFromTrialSessionAction } from './dismissThirtyDayAlertFromTrialSessionAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('dismissThirtyDayAlertFromTrialSessionAction', () => {
  const successMock = jest.fn();
  const errorMock = jest.fn();
  const mockState = {
    formattedTrialSessionDetails: {
      ...MOCK_TRIAL_REGULAR,
      dismissedAlertForNOTT: false,
    },
  };

  presenter.providers.path = {
    error: errorMock,
    success: successMock,
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .dismissNOTTReminderForTrialInteractor.mockResolvedValue(
        MOCK_TRIAL_REGULAR,
      );
  });

  it('should update the trial session from state after setting dismissedAlertForNOTT to true', async () => {
    await runAction(dismissThirtyDayAlertFromTrialSessionAction, {
      modules: {
        presenter,
      },
      state: mockState,
    });

    expect(
      applicationContext.getUseCases().dismissNOTTReminderForTrialInteractor
        .mock.calls[0][1].trialSessionId,
    ).toEqual(MOCK_TRIAL_REGULAR.trialSessionId);
  });

  it('should call the success path when the trial session has been successfully updated', async () => {
    await runAction(dismissThirtyDayAlertFromTrialSessionAction, {
      modules: {
        presenter,
      },
      state: mockState,
    });

    expect(successMock).toHaveBeenCalled();
  });

  it('should call the error path when the trial session has been successfully updated', async () => {
    applicationContext
      .getUseCases()
      .dismissNOTTReminderForTrialInteractor.mockRejectedValueOnce(
        new Error('bad'),
      );

    await runAction(dismissThirtyDayAlertFromTrialSessionAction, {
      modules: {
        presenter,
      },
      state: mockState,
    });

    expect(errorMock).toHaveBeenCalled();
  });
});
