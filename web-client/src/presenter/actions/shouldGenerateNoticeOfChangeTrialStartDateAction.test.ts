import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runAction } from '@web-client/presenter/test.cerebral';
import { presenter } from '@web-client/presenter/presenter-mock';
import { shouldGenerateNoticeOfChangeTrialStartDateAction } from './shouldGenerateNoticeOfChangeTrialStartDateAction';

describe('shouldGenerateNoticeOfChangeTrialStartDateAction', () => {
  let bothMock: jest.Mock;
  let unchangedMock: jest.Mock;

  const TRIAL_SESSION_ID = '959c4338-0fac-42eb-b0eb-d53b8d0195cc';

  const currentTrialSession = {
    trialSessionId: TRIAL_SESSION_ID,
    isCalendared: true,
    startDate: '2026-04-06',
  };

  const updatedTrialSessionSameDate = {
    ...currentTrialSession,
    startDate: '2026-04-06',
  };

  const updatedTrialSessionDifferentDate = {
    ...currentTrialSession,
    startDate: '2026-04-13',
  };

  beforeEach(() => {
    bothMock = jest.fn();
    unchangedMock = jest.fn();

    presenter.providers.path = {
      both: bothMock,
      unchanged: unchangedMock,
    };

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call "unchanged" path when start date has not changed', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionOpenCasesCountInteractor.mockResolvedValue({
        casesThatShouldReceiveNoticesCount: 1,
      });

    await runAction(shouldGenerateNoticeOfChangeTrialStartDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: updatedTrialSessionSameDate,
        formattedTrialSessionDetails: currentTrialSession,
      },
    });

    expect(unchangedMock).toHaveBeenCalledTimes(1);
    expect(bothMock).not.toHaveBeenCalled();
  });

  it('should call "unchanged" path when current trial session is not calendared', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionOpenCasesCountInteractor.mockResolvedValue({
        casesThatShouldReceiveNoticesCount: 1,
      });

    await runAction(shouldGenerateNoticeOfChangeTrialStartDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: { ...updatedTrialSessionDifferentDate, isCalendared: true },
        formattedTrialSessionDetails: {
          ...currentTrialSession,
          isCalendared: false,
        },
      },
    });

    expect(unchangedMock).toHaveBeenCalledTimes(1);
    expect(bothMock).not.toHaveBeenCalled();
  });

  it('should call "unchanged" path when there are no cases to receive notices', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionOpenCasesCountInteractor.mockResolvedValue({
        casesThatShouldReceiveNoticesCount: 0,
      });

    await runAction(shouldGenerateNoticeOfChangeTrialStartDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: updatedTrialSessionDifferentDate,
        formattedTrialSessionDetails: currentTrialSession,
      },
    });

    expect(unchangedMock).toHaveBeenCalledTimes(1);
    expect(bothMock).not.toHaveBeenCalled();
  });

  it('should call "both" path when start date has changed and there are cases to receive notices', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionOpenCasesCountInteractor.mockResolvedValue({
        casesThatShouldReceiveNoticesCount: 1,
      });

    await runAction(shouldGenerateNoticeOfChangeTrialStartDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: updatedTrialSessionDifferentDate,
        formattedTrialSessionDetails: currentTrialSession,
      },
    });

    expect(unchangedMock).not.toHaveBeenCalled();
    expect(bothMock).toHaveBeenCalledTimes(1);
    expect(bothMock.mock.calls[0][0]).toEqual({
      currentTrialSessionStartDate: currentTrialSession,
      updatedTrialSessionStartDate: updatedTrialSessionDifferentDate,
    });
  });
});
