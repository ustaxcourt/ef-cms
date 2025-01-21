import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getUniqueId } from '@shared/sharedAppContext';
import {
  createWorkingCopyForNewUserOnSession,
  getPaperServicePdfName,
  shouldGenerateNoticeOfChangeOfTrialJudge,
  shouldGenerateNoticeOfChangeToInPersonProceeding,
  shouldGenerateNoticeOfChangeToRemoteProceeding,
} from '@web-api/business/useCases/trialSessions/updateTrialSessionInteractorHelper';

describe('updateTrialSessionInteractorHelper', () => {
  describe('createWorkingCopyForNewUserOnSession', () => {
    it('should call method with correct parameters', async () => {
      const TEST_TRIAL_SESSION_ID = getUniqueId();
      const TEST_USER_ID = getUniqueId();
      const TEST_PARAMS = {
        applicationContext,
        trialSessionId: TEST_TRIAL_SESSION_ID,
        userId: TEST_USER_ID,
      };

      await createWorkingCopyForNewUserOnSession(TEST_PARAMS);

      const createTrialSessionWorkingCopyCalls =
        applicationContext.getPersistenceGateway().createTrialSessionWorkingCopy
          .mock.calls;

      expect(createTrialSessionWorkingCopyCalls.length).toEqual(1);
      expect(
        createTrialSessionWorkingCopyCalls[0][0].trialSessionWorkingCopy,
      ).toMatchObject({
        trialSessionId: TEST_TRIAL_SESSION_ID,
        userId: TEST_USER_ID,
      });
    });
  });

  describe('getPaperServicePdfName', () => {
    it('should return default string', async () => {
      const TEST_PARAMS = {
        shouldIssueNoticeOfChangeOfTrialJudge: false,
        shouldSetNoticeOfChangeToInPersonProceeding: false,
        shouldSetNoticeOfChangeToRemoteProceeding: false,
        shouldSetNoticeOfTrialSessionLocationChange: false,
      };

      const results = await getPaperServicePdfName(TEST_PARAMS);

      expect(results).toEqual('Notice of Change');
    });

    it('should return "Notice of Change of Trial Location" when shouldSetNoticeOfTrialSessionLocationChange is true', async () => {
      const TEST_PARAMS = {
        shouldIssueNoticeOfChangeOfTrialJudge: false,
        shouldSetNoticeOfChangeToInPersonProceeding: false,
        shouldSetNoticeOfChangeToRemoteProceeding: false,
        shouldSetNoticeOfTrialSessionLocationChange: true,
      };

      const results = await getPaperServicePdfName(TEST_PARAMS);

      expect(results).toEqual('Notice of Change of Trial Location');
    });

    it('should return "Notice of Change to Remote Proceeding" when shouldSetNoticeOfChangeToRemoteProceeding is true', async () => {
      const TEST_PARAMS = {
        shouldIssueNoticeOfChangeOfTrialJudge: false,
        shouldSetNoticeOfChangeToInPersonProceeding: false,
        shouldSetNoticeOfChangeToRemoteProceeding: true,
        shouldSetNoticeOfTrialSessionLocationChange: false,
      };

      const results = await getPaperServicePdfName(TEST_PARAMS);

      expect(results).toEqual('Notice of Change to Remote Proceeding');
    });

    it('should return "Notice of Change to In Person Proceeding" when shouldSetNoticeOfChangeToInPersonProceeding is true', async () => {
      const TEST_PARAMS = {
        shouldIssueNoticeOfChangeOfTrialJudge: false,
        shouldSetNoticeOfChangeToInPersonProceeding: true,
        shouldSetNoticeOfChangeToRemoteProceeding: false,
        shouldSetNoticeOfTrialSessionLocationChange: false,
      };

      const results = await getPaperServicePdfName(TEST_PARAMS);

      expect(results).toEqual('Notice of Change to In Person Proceeding');
    });

    it('should return "Notice of Change of Trial Judge" when shouldIssueNoticeOfChangeOfTrialJudge is true', async () => {
      const TEST_PARAMS = {
        shouldIssueNoticeOfChangeOfTrialJudge: true,
        shouldSetNoticeOfChangeToInPersonProceeding: false,
        shouldSetNoticeOfChangeToRemoteProceeding: false,
        shouldSetNoticeOfTrialSessionLocationChange: false,
      };

      const results = await getPaperServicePdfName(TEST_PARAMS);

      expect(results).toEqual('Notice of Change of Trial Judge');
    });
  });

  describe('shouldGenerateNoticeOfChangeToRemoteProceeding', () => {
    it('should return "true" when the calendared Trial Session went from "In Person" to "Remote"', async () => {
      const currentTrialSession = {
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        isCalendared: true,
      } as RawTrialSession;

      const updatedTrialSession = {
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        isCalendared: true,
      } as RawTrialSession;

      const results = await shouldGenerateNoticeOfChangeToRemoteProceeding(
        currentTrialSession,
        updatedTrialSession,
      );

      expect(results).toEqual(true);
    });

    it('should return "true" when the calendared Trial Session remains in "In Person"', async () => {
      const currentTrialSession = {
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        isCalendared: true,
      } as RawTrialSession;

      const updatedTrialSession = {
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        isCalendared: true,
      } as RawTrialSession;

      const results = await shouldGenerateNoticeOfChangeToRemoteProceeding(
        currentTrialSession,
        updatedTrialSession,
      );

      expect(results).toEqual(false);
    });

    it('should return "true" when a not calendared Trial Session went from "In Person" to "Remote"', async () => {
      const currentTrialSession = {
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        isCalendared: false,
      } as RawTrialSession;

      const updatedTrialSession = {
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        isCalendared: false,
      } as RawTrialSession;

      const results = await shouldGenerateNoticeOfChangeToRemoteProceeding(
        currentTrialSession,
        updatedTrialSession,
      );

      expect(results).toEqual(false);
    });
  });

  describe('shouldGenerateNoticeOfChangeOfTrialJudge', () => {
    it('should return "true" when the calendared Trial Session went from one Judge Id to a different Judge Id', async () => {
      const currentTrialSession = {
        judge: {
          userId: 'current-id',
        },
        isCalendared: true,
      } as RawTrialSession;

      const updatedTrialSession = {
        judge: {
          userId: 'updated-id',
        },
        isCalendared: true,
      } as RawTrialSession;

      const results = await shouldGenerateNoticeOfChangeOfTrialJudge(
        currentTrialSession,
        updatedTrialSession,
      );

      expect(results).toEqual(true);
    });

    it('should return "false" when the calendared Trial Session remained with same Judge Id', async () => {
      const currentTrialSession = {
        judge: {
          userId: 'current-id',
        },
        isCalendared: true,
      } as RawTrialSession;

      const updatedTrialSession = {
        judge: {
          userId: 'current-id',
        },
        isCalendared: true,
      } as RawTrialSession;

      const results = await shouldGenerateNoticeOfChangeOfTrialJudge(
        currentTrialSession,
        updatedTrialSession,
      );

      expect(results).toEqual(false);
    });

    it('should return "false" when a not calendared Trial Session went from one Judge Id to a different Judge Id', async () => {
      const currentTrialSession = {
        judge: {
          userId: 'current-id',
        },
        isCalendared: false,
      } as RawTrialSession;

      const updatedTrialSession = {
        judge: {
          userId: 'updated-id',
        },
        isCalendared: false,
      } as RawTrialSession;

      const results = await shouldGenerateNoticeOfChangeOfTrialJudge(
        currentTrialSession,
        updatedTrialSession,
      );

      expect(results).toEqual(false);
    });

    it('should return "false" when the calendared Trial Session did not have a judge and then did', async () => {
      const currentTrialSession = {
        judge: undefined,
        isCalendared: true,
      } as RawTrialSession;

      const updatedTrialSession = {
        judge: {
          userId: 'current-id',
        },
        isCalendared: true,
      } as RawTrialSession;

      const results = await shouldGenerateNoticeOfChangeOfTrialJudge(
        currentTrialSession,
        updatedTrialSession,
      );

      expect(results).toEqual(false);
    });

    it('should return "false" when the calendared Trial Session had a judge and then not', async () => {
      const currentTrialSession = {
        judge: {
          userId: 'current-id',
        },
        isCalendared: true,
      } as RawTrialSession;

      const updatedTrialSession = {
        judge: undefined,
        isCalendared: true,
      } as RawTrialSession;

      const results = await shouldGenerateNoticeOfChangeOfTrialJudge(
        currentTrialSession,
        updatedTrialSession,
      );

      expect(results).toEqual(false);
    });
  });

  describe('shouldGenerateNoticeOfChangeToInPersonProceeding', () => {
    it('should return "true" when the calendared Trial Session went from "Remote" to "In Person"', async () => {
      const currentTrialSession = {
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        isCalendared: true,
      } as RawTrialSession;

      const updatedTrialSession = {
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        isCalendared: true,
      } as RawTrialSession;

      const results = await shouldGenerateNoticeOfChangeToInPersonProceeding(
        currentTrialSession,
        updatedTrialSession,
      );

      expect(results).toEqual(true);
    });

    it('should return "false" when the calendared Trial Session remains as "Remote"', async () => {
      const currentTrialSession = {
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        isCalendared: true,
      } as RawTrialSession;

      const updatedTrialSession = {
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        isCalendared: true,
      } as RawTrialSession;

      const results = await shouldGenerateNoticeOfChangeToInPersonProceeding(
        currentTrialSession,
        updatedTrialSession,
      );

      expect(results).toEqual(false);
    });

    it('should return "false" when a not calendared Trial Session went from "Remote" to "In Person"', async () => {
      const currentTrialSession = {
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        isCalendared: false,
      } as RawTrialSession;

      const updatedTrialSession = {
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        isCalendared: false,
      } as RawTrialSession;

      const results = await shouldGenerateNoticeOfChangeToInPersonProceeding(
        currentTrialSession,
        updatedTrialSession,
      );

      expect(results).toEqual(false);
    });
  });
});
