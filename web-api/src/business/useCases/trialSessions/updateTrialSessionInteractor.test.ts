jest.mock(
  '@web-api/business/useCases/trialSessions/updateTrialSessionInteractorHelper',
);
jest.mock(
  '@shared/business/utilities/trialSession/shouldGenerateNoticeOfChangeTrialLocation',
);
jest.mock(
  '@web-api/business/useCaseHelper/trialSessions/associateSwingTrialSessions',
);
jest.mock('@web-api/persistence/dynamo/trialSessions/updateTrialSession');
jest.mock('@web-api/business/useCaseHelper/saveFileAndGenerateUrl');
jest.mock('@web-api/notifications/sendNotificationToUser');
jest.mock('@web-api/persistence/dynamo/trialSessions/getTrialSessionById');

import '@web-api/persistence/postgres/caseCorrespondences/mocks.jest';
import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import {
  RawTrialSession,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { shouldGenerateNoticeOfChangeTrialLocation } from '@shared/business/utilities/trialSession/shouldGenerateNoticeOfChangeTrialLocation';
import { getUniqueId } from '@shared/sharedAppContext';
import { mockCaseServicesSupervisorUser } from '@shared/test/mockAuthUsers';
import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import {
  
  determineEntitiesToLock,
  updateTrialSession,
} from '@web-api/business/useCases/trialSessions/updateTrialSessionInteractor';

import {
  shouldCreateWorkingCopyForNewJudge,
  createWorkingCopyForNewUserOnSession,
  shouldCreateWorkingCopyForNewTrialClerk,
  shouldGenerateNoticeOfChangeToInPersonProceeding,
  shouldGenerateNoticeOfChangeOfTrialJudge,
  updateCasesAndSetNoticeOfChange,
  getPaperServicePdfName,
  shouldGenerateNoticeOfChangeToRemoteProceeding,
} from '@web-api/business/useCases/trialSessions/updateTrialSessionInteractorHelper';
import { cloneDeep } from 'lodash';
import { getTrialSessionById } from '@web-api/persistence/dynamo/trialSessions/getTrialSessionById';
import { sendNotificationToUser } from '@web-api/notifications/sendNotificationToUser';
import { updateTrialSession as updateTrialSessionPersistence } from '@web-api/persistence/dynamo/trialSessions/updateTrialSession';
import { associateSwingTrialSessions } from '@web-api/business/useCaseHelper/trialSessions/associateSwingTrialSessions';
import { saveFileAndGenerateUrl } from '@web-api/business/useCaseHelper/saveFileAndGenerateUrl';

describe('updateTrialSessionInteractor', () => {
  describe('updateTrialSession', () => {
    let TEST_TRIAL_SESSION;
    const TEST_TRIAL_SESSION_ID = getUniqueId();
    const TEST_CLIENT_CONNECTION_ID = 'TEST_CLIENT_CONNECTION_ID';
    const TEST_FILE_GUID = getUniqueId();
    const TEST_TRIAL_CLERK_ID = getUniqueId();
    const MOCK_SAVE_RESULTS = 'MOCK_SAVE_RESULTS';
    const MOCK_FILE_URL = 'MOCK_FILE_URL';

    beforeEach(() => {
      TEST_TRIAL_SESSION = cloneDeep(MOCK_TRIAL_INPERSON);

      (updateCasesAndSetNoticeOfChange as jest.Mock).mockReturnValue({
        getPageCount: () => 1,
        save: () => MOCK_SAVE_RESULTS,
      });

      (saveFileAndGenerateUrl as jest.Mock).mockReturnValue({
        fileId: TEST_FILE_GUID,
        url: MOCK_FILE_URL,
      });

      (getPaperServicePdfName as jest.Mock).mockReturnValue('TEST_PDF_NAME');
    });

    it('should throw an "Unauthorized" error when authorizedUser is not provided', async () => {
      await expect(
        updateTrialSession(applicationContext, {} as any, undefined),
      ).rejects.toThrow('Unauthorized');
    });

    it('should throw an error when start date is in the past', async () => {
      (getTrialSessionById as jest.Mock).mockReturnValue({
        trialSessionId: TEST_TRIAL_SESSION_ID,
        startDate: '2000-03-01T21:40:46.415Z',
      });

      await expect(
        updateTrialSession(
          applicationContext,
          {
            trialSession: {
              trialSessionId: TEST_TRIAL_SESSION_ID,
            } as unknown as RawTrialSession,
            clientConnectionId: TEST_CLIENT_CONNECTION_ID,
          },
          mockCaseServicesSupervisorUser,
        ),
      ).rejects.toThrow('Trial session cannot be updated after its start date');
    });

    it('should call "createWorkingCopyForNewUserOnSession" for new judge and new trial clerk', async () => {
      (shouldCreateWorkingCopyForNewJudge as jest.Mock).mockReturnValue(true);

      (shouldCreateWorkingCopyForNewTrialClerk as jest.Mock).mockReturnValue(
        true,
      );

      (getTrialSessionById as jest.Mock).mockReturnValue({
        ...TEST_TRIAL_SESSION,
        trialSessionId: TEST_TRIAL_SESSION_ID,
        startDate: '9999-03-01T21:40:46.415Z',
      });

      await updateTrialSession(
        applicationContext,
        {
          trialSession: {
            ...TEST_TRIAL_SESSION,
            trialSessionId: TEST_TRIAL_SESSION_ID,
            trialClerk: {
              userId: TEST_TRIAL_CLERK_ID,
              name: 'TEST_TRIAL_CLERK_NAME',
            },
          } as unknown as RawTrialSession,
          clientConnectionId: TEST_CLIENT_CONNECTION_ID,
        },
        mockCaseServicesSupervisorUser,
      );

      const workingCopyCalls = (
        createWorkingCopyForNewUserOnSession as jest.Mock
      ).mock.calls;

      expect(workingCopyCalls.length).toEqual(2);
      expect(workingCopyCalls[0][0].userId).toEqual(
        TEST_TRIAL_SESSION.judge?.userId,
      );
      expect(workingCopyCalls[1][0].userId).toEqual(TEST_TRIAL_CLERK_ID);
    });

    it('should not call "createWorkingCopyForNewUserOnSession" when the flags are false', async () => {
      (shouldCreateWorkingCopyForNewJudge as jest.Mock).mockReturnValue(false);

      (shouldCreateWorkingCopyForNewTrialClerk as jest.Mock).mockReturnValue(
        false,
      );

      (getTrialSessionById as jest.Mock).mockReturnValue({
        ...TEST_TRIAL_SESSION,
        trialSessionId: TEST_TRIAL_SESSION_ID,
        startDate: '9999-03-01T21:40:46.415Z',
      });

      await updateTrialSession(
        applicationContext,
        {
          trialSession: {
            ...TEST_TRIAL_SESSION,
            trialSessionId: TEST_TRIAL_SESSION_ID,
            trialClerk: {
              userId: TEST_TRIAL_CLERK_ID,
              name: 'TEST_TRIAL_CLERK_NAME',
            },
          } as unknown as RawTrialSession,
          clientConnectionId: TEST_CLIENT_CONNECTION_ID,
        },
        mockCaseServicesSupervisorUser,
      );

      const workingCopyCalls = (
        createWorkingCopyForNewUserOnSession as jest.Mock
      ).mock.calls;

      expect(workingCopyCalls.length).toEqual(0);
    });

    it('should generate all the notices for each case and update trial session', async () => {
      (
        shouldGenerateNoticeOfChangeToInPersonProceeding as jest.Mock
      ).mockReturnValue(true);

      (shouldGenerateNoticeOfChangeOfTrialJudge as jest.Mock).mockReturnValue(
        true,
      );

      (
        shouldGenerateNoticeOfChangeToRemoteProceeding as jest.Mock
      ).mockReturnValue(true);

      (shouldGenerateNoticeOfChangeTrialLocation as jest.Mock).mockReturnValue(
        true,
      );

      (getTrialSessionById as jest.Mock).mockReturnValue({
        ...TEST_TRIAL_SESSION,
        trialSessionId: TEST_TRIAL_SESSION_ID,
        startDate: '9999-03-01T21:40:46.415Z',
        caseOrder: [{ docketNumber: '111-25' }],
      });

      await updateTrialSession(
        applicationContext,
        {
          trialSession: {
            ...TEST_TRIAL_SESSION,
            trialSessionId: TEST_TRIAL_SESSION_ID,
            trialClerk: {
              userId: TEST_TRIAL_CLERK_ID,
              name: 'TEST_TRIAL_CLERK_NAME',
            },
          } as unknown as RawTrialSession,
          clientConnectionId: TEST_CLIENT_CONNECTION_ID,
        },
        mockCaseServicesSupervisorUser,
      );

      const updateCasesAndSetNoticeOfChangeCalls = (
        updateCasesAndSetNoticeOfChange as jest.Mock
      ).mock.calls;

      expect(updateCasesAndSetNoticeOfChangeCalls.length).toEqual(1);
      expect(updateCasesAndSetNoticeOfChangeCalls[0][0]).toMatchObject({
        shouldIssueNoticeOfChangeOfTrialJudge: true,
        shouldSetNoticeOfChangeToInPersonProceeding: true,
        shouldSetNoticeOfChangeToRemoteProceeding: true,
        shouldSetNoticeOfTrialSessionLocationChange: true,
      });

      const saveFileAndGenerateUrlCalls = (saveFileAndGenerateUrl as jest.Mock)
        .mock.calls;

      expect(saveFileAndGenerateUrlCalls.length).toEqual(1);
      expect(saveFileAndGenerateUrlCalls[0][0]).toMatchObject({
        fileNamePrefix: 'paper-service-pdf/',
        file: MOCK_SAVE_RESULTS,
      });

      const updateTrialSessionCalls = (
        updateTrialSessionPersistence as jest.Mock
      ).mock.calls;
      expect(updateTrialSessionCalls.length).toEqual(1);
      expect(updateTrialSessionCalls[0][0].trialSessionToUpdate).toMatchObject({
        paperServicePdfs: [
          {
            fileId: TEST_FILE_GUID,
            title: 'TEST_PDF_NAME',
          },
        ],
      });

      const sendNotificationToUserCalls = (sendNotificationToUser as jest.Mock)
        .mock.calls;

      expect(sendNotificationToUserCalls.length).toEqual(1);
      expect(sendNotificationToUserCalls[0][0]).toMatchObject({
        clientConnectionId: TEST_CLIENT_CONNECTION_ID,
        message: {
          action: 'update_trial_session_complete',
          fileId: TEST_FILE_GUID,
          hasPaper: true,
          pdfUrl: MOCK_FILE_URL,
          trialSessionId: TEST_TRIAL_SESSION_ID,
        },
        userId: mockCaseServicesSupervisorUser.userId,
      });
    });

    it('should update associated swing trial session', async () => {
      const SWING_ID = getUniqueId();

      (getTrialSessionById as jest.Mock).mockReturnValue({
        ...TEST_TRIAL_SESSION,
        trialSessionId: TEST_TRIAL_SESSION_ID,
        startDate: '9999-03-01T21:40:46.415Z',
        caseOrder: [{ docketNumber: '111-25' }],
      });

      await updateTrialSession(
        applicationContext,
        {
          trialSession: {
            ...TEST_TRIAL_SESSION,
            trialSessionId: TEST_TRIAL_SESSION_ID,
            trialClerk: {
              userId: TEST_TRIAL_CLERK_ID,
              name: 'TEST_TRIAL_CLERK_NAME',
            },
            swingSession: true,
            swingSessionId: SWING_ID,
          } as unknown as RawTrialSession,
          clientConnectionId: TEST_CLIENT_CONNECTION_ID,
        },
        mockCaseServicesSupervisorUser,
      );

      const associateSwingTrialSessionsCalls = (
        associateSwingTrialSessions as jest.Mock
      ).mock.calls;

      expect(associateSwingTrialSessionsCalls.length).toEqual(1);
      expect(associateSwingTrialSessionsCalls[0][1]).toMatchObject({
        swingSessionId: SWING_ID,
      });
    });
  });

  describe('determineEntitiesToLock', () => {
    beforeEach(() => {
      (getTrialSessionById as jest.Mock).mockImplementation(() => {
        return {
          caseOrder: [
            { docketNumber: '333-25' },
            { docketNumber: '111-25' },
            { docketNumber: '222-25' },
          ],
        };
      });
    });

    it('should return the correct identifiers to lock', async () => {
      const TEST_TRIAL_SESSION_ID = getUniqueId();
      const results = await determineEntitiesToLock(applicationContext, {
        trialSession: {
          trialSessionId: TEST_TRIAL_SESSION_ID,
        } as TrialSession,
      });

      expect(results).toEqual({
        identifiers: [
          `trial-session|${TEST_TRIAL_SESSION_ID}`,
          'case|333-25',
          'case|111-25',
          'case|222-25',
        ],
        ttl: 900,
      });
    });

    it('should throw an error when the trial session is not found', async () => {
      const TEST_TRIAL_SESSION_ID = getUniqueId();

      (getTrialSessionById as jest.Mock).mockImplementation(() => undefined);

      await expect(
        determineEntitiesToLock(applicationContext, {
          trialSession: {
            trialSessionId: TEST_TRIAL_SESSION_ID,
          } as TrialSession,
        }),
      ).rejects.toThrow(
        `Trial session ${TEST_TRIAL_SESSION_ID} was not found.`,
      );
    });

    it('should call with empty string if no trial session id is provided', async () => {
      (getTrialSessionById as jest.Mock).mockImplementation(() => undefined);

      await expect(
        determineEntitiesToLock(applicationContext, {
          trialSession: {
            trialSessionId: undefined,
          } as TrialSession,
        }),
      ).rejects.toThrow(`Trial session undefined was not found.`);

      const getTrialSessionByIdCalls = (getTrialSessionById as jest.Mock).mock
        .calls;

      expect(getTrialSessionByIdCalls.length).toEqual(1);
      expect(getTrialSessionByIdCalls[0][0].trialSessionId).toEqual('');
    });
  });
});
