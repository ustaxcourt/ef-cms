import { MOCK_TRIAL_REGULAR } from '../../../../../shared/src/test/mockTrial';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { setNoticesForCalendaredTrialSessionInteractor } from './setNoticesForCalendaredTrialSessionInteractor';

describe('setNoticesForCalendaredTrialSessionInteractor', () => {
  const trialSessionId = '6805d1ab-18d0-43ec-bafb-654e83405416';

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockResolvedValue([
        {
          docketNumber: '101-20',
        },
        {
          docketNumber: '102-20',
        },
        {
          docketNumber: '103-20',
        },
      ]);
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue({
        ...MOCK_TRIAL_REGULAR,
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      });
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionJobStatusForCase.mockResolvedValueOnce({
        unfinishedCases: 0,
      })
      .mockResolvedValueOnce({
        unfinishedCases: 1,
      });
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValue(true);
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionProcessingStatus.mockResolvedValue(undefined);

    applicationContext.logger.warn.mockResolvedValue(
      `A duplicate event was recieved for setting the notices for trial session: ${trialSessionId}`,
    );

    jest
      .spyOn(global, 'setInterval')
      .mockImplementation((cb): ReturnType<typeof setTimeout> => {
        // eslint-disable-next-line promise/no-callback-in-promise
        (cb() as any).then(cb);
        return undefined;
      });
  });

  it('should return an unauthorized error if the user does not have the TRIAL_SESSIONS permission', async () => {
    let error;

    try {
      await setNoticesForCalendaredTrialSessionInteractor(
        applicationContext,
        {
          trialSessionId,
        },
        mockPetitionerUser,
      );
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });

  it('should NOT attempt to paper service a case with no corresponding case data information', async () => {
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValue(false);

    await setNoticesForCalendaredTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId,
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUtilities().copyPagesFromPdf,
    ).not.toHaveBeenCalled();
  });

  it('should NOT attempt to start a trial session calendering event if its already processing or completed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionProcessingStatus.mockResolvedValueOnce('processing');

    await setNoticesForCalendaredTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId,
      },
      mockPetitionsClerkUser,
    );
    expect(
      applicationContext.getMessageGateway().sendSetTrialSessionCalendarEvent,
    ).not.toHaveBeenCalled();
    expect(applicationContext.logger.warn).toHaveBeenCalledWith(
      `A duplicate event was received for setting the notices for trial session: ${trialSessionId}`,
    );

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionProcessingStatus.mockResolvedValueOnce('complete');

    await setNoticesForCalendaredTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId,
      },
      mockPetitionsClerkUser,
    );
    expect(
      applicationContext.getMessageGateway().sendSetTrialSessionCalendarEvent,
    ).not.toHaveBeenCalled();
    expect(applicationContext.logger.warn).toHaveBeenCalledWith(
      expect.stringContaining(trialSessionId),
    );
  });

  it('should set trialSessionStatus to processing if this is the first trial session calendering event', async () => {
    await setNoticesForCalendaredTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId,
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway()
        .setTrialSessionProcessingStatus,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        trialSessionStatus: 'processing',
      }),
    );
  });

  it('should set the trial session status as complete after all the calendering jobs is completed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionJobStatusForCase.mockResolvedValueOnce({
        unfinishedCases: 0,
      });

    await setNoticesForCalendaredTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId,
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway()
        .setTrialSessionProcessingStatus,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        trialSessionStatus: 'complete',
      }),
    );
  });

  it('should send a notification with no paper service indicator and no pdf keys for trial sessions with no calendared cases', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockResolvedValue([]);

    await setNoticesForCalendaredTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId,
      },
      mockPetitionsClerkUser,
    );

    const result =
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0];

    expect(result).toMatchObject({
      message: {
        action: 'notice_generation_complete',
        hasPaper: false,
        trialNoticePdfsKeys: [],
      },
      userId: mockPetitionsClerkUser.userId,
    });
  });
});
