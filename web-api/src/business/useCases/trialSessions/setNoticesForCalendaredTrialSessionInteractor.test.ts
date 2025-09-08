import '@web-api/persistence/postgres/utils/mocks.jest';
import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { setNoticesForCalendaredTrialSessionInteractor } from './setNoticesForCalendaredTrialSessionInteractor';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import {
  getCalendaredCasesForTrialSession as getCalendaredCasesForTrialSessionMock,
  RawCaseAndCaseOrder,
} from '@web-api/persistence/postgres/trialSessions/getCalendaredCasesForTrialSession';
import { getTrialSessionNotificationProcessing as getTrialSessionNotificationProcessingMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionNotificationProcessing';
import { createTrialSessionNotificationProcessing as createTrialSessionNotificationProcessingMock } from '@web-api/persistence/postgres/trialSessions/createTrialSessionNotificationProcessing';
import { updateTrialSessionNotificationProcessing as updateTrialSessionNotificationProcessingMock } from '@web-api/persistence/postgres/trialSessions/updateTrialSessionNotificationProcessing';

describe('setNoticesForCalendaredTrialSessionInteractor', () => {
  const trialSessionId = '6805d1ab-18d0-43ec-bafb-654e83405416';
  const clientConnectionId = '334304ba-79e6-4a1d-bd36-1e61f657a7ff';

  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
  const getCalendaredCasesForTrialSession = jest.mocked(
    getCalendaredCasesForTrialSessionMock,
  );
  const updateTrialSessionNotificationProcessing = jest.mocked(
    updateTrialSessionNotificationProcessingMock,
  );
  const createTrialSessionNotificationProcessing = jest.mocked(
    createTrialSessionNotificationProcessingMock,
  );
  const getTrialSessionNotificationProcessing = jest.mocked(
    getTrialSessionNotificationProcessingMock,
  );

  beforeEach(() => {
    getCalendaredCasesForTrialSession.mockResolvedValue([
      {
        docketNumber: '101-20',
      },
      {
        docketNumber: '102-20',
      },
      {
        docketNumber: '103-20',
      },
    ] as unknown as RawCaseAndCaseOrder[]);

    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_REGULAR,
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    });

    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValue(true);

    applicationContext.logger.warn.mockResolvedValue(
      `A duplicate event was recieved for setting the notices for trial session: ${trialSessionId}`,
    );

    jest
      .spyOn(global, 'setInterval')
      .mockImplementation((cb): ReturnType<typeof setTimeout> => {
        (cb() as any).then(cb);
        return undefined as any;
      });
  });

  it('should return an unauthorized error if the user does not have the TRIAL_SESSIONS permission', async () => {
    let error;

    try {
      await setNoticesForCalendaredTrialSessionInteractor(
        applicationContext,
        {
          clientConnectionId,
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
    getTrialSessionNotificationProcessing
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({
        unfinishedCases: 3,
        status: 'processing',
        trialSessionId,
        caseStatuses: {},
      })
      .mockResolvedValueOnce({
        unfinishedCases: 0,
        status: 'processing',
        trialSessionId,
        caseStatuses: {},
      });
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValue(false);

    await setNoticesForCalendaredTrialSessionInteractor(
      applicationContext,
      {
        clientConnectionId,
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
    getTrialSessionNotificationProcessing.mockResolvedValueOnce({
      unfinishedCases: 1,
      status: 'processing',
      trialSessionId,
      caseStatuses: {},
    });

    await setNoticesForCalendaredTrialSessionInteractor(
      applicationContext,
      {
        clientConnectionId,
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

    getTrialSessionNotificationProcessing.mockResolvedValueOnce({
      unfinishedCases: 1,
      status: 'complete',
      trialSessionId,
      caseStatuses: {},
    });

    await setNoticesForCalendaredTrialSessionInteractor(
      applicationContext,
      {
        clientConnectionId,
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
    getTrialSessionNotificationProcessing
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({
        unfinishedCases: 3,
        status: 'processing',
        trialSessionId,
        caseStatuses: {},
      })
      .mockResolvedValueOnce({
        unfinishedCases: 0,
        status: 'processing',
        trialSessionId,
        caseStatuses: {},
      });

    await setNoticesForCalendaredTrialSessionInteractor(
      applicationContext,
      {
        clientConnectionId,
        trialSessionId,
      },
      mockPetitionsClerkUser,
    );

    expect(createTrialSessionNotificationProcessing).toHaveBeenCalledWith({
      trialSessionId,
      unfinishedCasesCount: 3,
    });
  });

  it('should set the trial session status as complete after all the calendering jobs is completed', async () => {
    getTrialSessionNotificationProcessing
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({
        unfinishedCases: 3,
        status: 'processing',
        trialSessionId,
        caseStatuses: {},
      })
      .mockResolvedValueOnce({
        unfinishedCases: 0,
        status: 'processing',
        trialSessionId,
        caseStatuses: {},
      });

    await setNoticesForCalendaredTrialSessionInteractor(
      applicationContext,
      {
        clientConnectionId,
        trialSessionId,
      },
      mockPetitionsClerkUser,
    );

    expect(updateTrialSessionNotificationProcessing).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'complete',
      }),
    );
  });

  it('should send a notification with no paper service indicator and no pdf keys for trial sessions with no calendared cases', async () => {
    getCalendaredCasesForTrialSession.mockResolvedValue([]);

    await setNoticesForCalendaredTrialSessionInteractor(
      applicationContext,
      {
        clientConnectionId,
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
