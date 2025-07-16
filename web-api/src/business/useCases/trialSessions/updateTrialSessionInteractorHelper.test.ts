import '@web-api/persistence/postgres/cases/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import {
  CASE_STATUS_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import {
  RawTrialSession,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getUniqueId } from '@shared/sharedAppContext';
import { mockCaseServicesSupervisorUser } from '@shared/test/mockAuthUsers';
import { MOCK_CASE } from '@shared/test/mockCase';
import {
  createWorkingCopyForNewUserOnSession,
  getPaperServicePdfName,
  shouldCreateWorkingCopyForNewJudge,
  shouldCreateWorkingCopyForNewTrialClerk,
  shouldGenerateNoticeOfChangeOfTrialJudge,
  shouldGenerateNoticeOfChangeToInPersonProceeding,
  shouldGenerateNoticeOfChangeToRemoteProceeding,
  updateCasesAndSetNoticeOfChange,
} from '@web-api/business/useCases/trialSessions/updateTrialSessionInteractorHelper';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

describe('updateTrialSessionInteractorHelper', () => {
  const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);

  describe('updateCasesAndSetNoticeOfChange', () => {
    const TEST_DOCKET_NUMBERS = ['111-25', '222-25', '333-25', '444-25'];
    const TEST_TRIAL_SESSION_ID: string = getUniqueId();
    const MOCK_PAPER_SERVICE_PDF_COMBINED = 'MOCK_PAPER_SERVICE_PDF_COMBINED';
    const VALIDATED_TRIAL_SESSION_ENTITY = 'VALIDATED_TRIAL_SESSION_ENTITY';

    beforeEach(() => {
      getCasesByDocketNumbers.mockImplementation(({ docketNumbers }) => {
        function getMockedCase(docketNumber: string) {
          return {
            ...MOCK_CASE,
            docketNumber,
            status:
              docketNumber === '222-25'
                ? CASE_STATUS_TYPES.closed
                : CASE_STATUS_TYPES.calendared,
            trialSessionId:
              docketNumber === '333-25' ? getUniqueId() : TEST_TRIAL_SESSION_ID,
            trialDate: '9999-03-01T21:40:46.415Z',
            hearings:
              docketNumber === '222-25'
                ? [{ trialSessionId: TEST_TRIAL_SESSION_ID }]
                : [],
          } as RawCase;
        }
        return Promise.resolve(
          docketNumbers.map(docketNumber => getMockedCase(docketNumber)),
        );
      });

      applicationContext.getUseCaseHelpers().setNoticeOfChangeToRemoteProceeding =
        jest.fn();

      applicationContext.getUseCaseHelpers().setNoticeOfChangeToInPersonProceeding =
        jest.fn();

      applicationContext.getUseCaseHelpers().setNoticeOfChangeOfTrialJudge =
        jest.fn();

      applicationContext.getUseCaseHelpers().setNoticeOfChangeOfTrialLocation =
        jest.fn();

      applicationContext
        .getUtilities()
        .combineAllPdfDocuments.mockImplementation(
          () => MOCK_PAPER_SERVICE_PDF_COMBINED,
        );
    });

    it('should generate all notices for the cases that are callendared and update case hearing', async () => {
      const TEST_PARAMS = {
        applicationContext,
        authorizedUser: mockCaseServicesSupervisorUser,
        currentTrialSession: {
          trialSessionId: TEST_TRIAL_SESSION_ID,
          caseOrder: TEST_DOCKET_NUMBERS.map(docketNumber => {
            return {
              docketNumber,
              removedFromTrial: docketNumber === '111-25',
            };
          }),
        } as unknown as RawTrialSession,
        shouldIssueNoticeOfChangeOfTrialJudge: true,
        shouldSetNoticeOfChangeToInPersonProceeding: true,
        shouldSetNoticeOfChangeToRemoteProceeding: true,
        shouldSetNoticeOfTrialSessionLocationChange: true,
        updatedTrialSessionEntity: {
          caseOrder: TEST_DOCKET_NUMBERS,
          trialSessionId: TEST_TRIAL_SESSION_ID,
          validate: () => ({
            toRawObject: () => VALIDATED_TRIAL_SESSION_ENTITY,
          }),
        } as unknown as TrialSession,
      };

      const results = await updateCasesAndSetNoticeOfChange(TEST_PARAMS);
      expect(results).toBe(MOCK_PAPER_SERVICE_PDF_COMBINED);

      const setNoticeOfChangeToRemoteProceedingCalls =
        applicationContext.getUseCaseHelpers()
          .setNoticeOfChangeToRemoteProceeding.mock.calls;
      expect(setNoticeOfChangeToRemoteProceedingCalls.length).toEqual(1);
      expect(
        setNoticeOfChangeToRemoteProceedingCalls[0][1].caseEntity.docketNumber,
      ).toEqual('444-25');

      const setNoticeOfChangeToInPersonProceedingCalls =
        applicationContext.getUseCaseHelpers()
          .setNoticeOfChangeToInPersonProceeding.mock.calls;
      expect(setNoticeOfChangeToInPersonProceedingCalls.length).toEqual(1);
      expect(
        setNoticeOfChangeToInPersonProceedingCalls[0][1].caseEntity
          .docketNumber,
      ).toEqual('444-25');

      const setNoticeOfChangeOfTrialJudgeCalls =
        applicationContext.getUseCaseHelpers().setNoticeOfChangeOfTrialJudge
          .mock.calls;
      expect(setNoticeOfChangeOfTrialJudgeCalls.length).toEqual(1);
      expect(
        setNoticeOfChangeOfTrialJudgeCalls[0][1].caseEntity.docketNumber,
      ).toEqual('444-25');

      const setNoticeOfChangeOfTrialLocationCalls =
        applicationContext.getUseCaseHelpers().setNoticeOfChangeOfTrialLocation
          .mock.calls;
      expect(setNoticeOfChangeOfTrialLocationCalls.length).toEqual(1);
      expect(
        setNoticeOfChangeOfTrialLocationCalls[0][1].caseEntity.docketNumber,
      ).toEqual('444-25');

      const updateCaseHearingCalls =
        applicationContext.getPersistenceGateway().updateCaseHearing.mock.calls;

      expect(updateCaseHearingCalls.length).toEqual(1);
      expect(updateCaseHearingCalls[0][0]).toMatchObject({
        docketNumber: '222-25',
        hearingToUpdate: VALIDATED_TRIAL_SESSION_ENTITY,
      });
    });

    it('should not generate notices when flags are "false"', async () => {
      const TEST_PARAMS = {
        applicationContext,
        authorizedUser: mockCaseServicesSupervisorUser,
        currentTrialSession: {
          trialSessionId: TEST_TRIAL_SESSION_ID,
          caseOrder: TEST_DOCKET_NUMBERS.map(docketNumber => {
            return {
              docketNumber,
              removedFromTrial: docketNumber === '111-25',
            };
          }),
        } as unknown as RawTrialSession,
        shouldIssueNoticeOfChangeOfTrialJudge: false,
        shouldSetNoticeOfChangeToInPersonProceeding: false,
        shouldSetNoticeOfChangeToRemoteProceeding: false,
        shouldSetNoticeOfTrialSessionLocationChange: false,
        updatedTrialSessionEntity: {
          caseOrder: TEST_DOCKET_NUMBERS,
          trialSessionId: TEST_TRIAL_SESSION_ID,
          validate: () => ({
            toRawObject: () => VALIDATED_TRIAL_SESSION_ENTITY,
          }),
        } as unknown as TrialSession,
      };

      const results = await updateCasesAndSetNoticeOfChange(TEST_PARAMS);
      expect(results).toBe(MOCK_PAPER_SERVICE_PDF_COMBINED);

      const setNoticeOfChangeToRemoteProceedingCalls =
        applicationContext.getUseCaseHelpers()
          .setNoticeOfChangeToRemoteProceeding.mock.calls;
      expect(setNoticeOfChangeToRemoteProceedingCalls.length).toEqual(0);

      const setNoticeOfChangeToInPersonProceedingCalls =
        applicationContext.getUseCaseHelpers()
          .setNoticeOfChangeToInPersonProceeding.mock.calls;
      expect(setNoticeOfChangeToInPersonProceedingCalls.length).toEqual(0);

      const setNoticeOfChangeOfTrialJudgeCalls =
        applicationContext.getUseCaseHelpers().setNoticeOfChangeOfTrialJudge
          .mock.calls;
      expect(setNoticeOfChangeOfTrialJudgeCalls.length).toEqual(0);

      const setNoticeOfChangeOfTrialLocationCalls =
        applicationContext.getUseCaseHelpers().setNoticeOfChangeOfTrialLocation
          .mock.calls;
      expect(setNoticeOfChangeOfTrialLocationCalls.length).toEqual(0);
    });
  });

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

  describe('shouldCreateWorkingCopyForNewJudge', () => {
    it('should return "true" when judge id changed from an existing one to another', async () => {
      const CURRENT_TRIAL_SESSION = {
        judge: {
          userId: 'current-user-id',
        },
      } as RawTrialSession;
      const UPDATED_TRIAL_SESSION = {
        judge: {
          userId: 'updated-user-id',
        },
      } as TrialSession;

      const results = await shouldCreateWorkingCopyForNewJudge(
        CURRENT_TRIAL_SESSION,
        UPDATED_TRIAL_SESSION,
      );

      expect(results).toEqual(true);
    });

    it('should return "true" when there was no judge user id to begin with and then one assigned', async () => {
      const CURRENT_TRIAL_SESSION = {
        judge: {
          userId: '',
        },
      } as RawTrialSession;
      const UPDATED_TRIAL_SESSION = {
        judge: {
          userId: 'updated-user-id',
        },
      } as TrialSession;

      const results = await shouldCreateWorkingCopyForNewJudge(
        CURRENT_TRIAL_SESSION,
        UPDATED_TRIAL_SESSION,
      );

      expect(results).toEqual(true);
    });

    it('should return "false" when judge id did not changed at all', async () => {
      const CURRENT_TRIAL_SESSION = {
        judge: {
          userId: 'current-user-id',
        },
      } as RawTrialSession;
      const UPDATED_TRIAL_SESSION = {
        judge: {
          userId: 'current-user-id',
        },
      } as TrialSession;

      const results = await shouldCreateWorkingCopyForNewJudge(
        CURRENT_TRIAL_SESSION,
        UPDATED_TRIAL_SESSION,
      );

      expect(results).toEqual(false);
    });

    it('should return "false" when there is no judge id at all', async () => {
      const CURRENT_TRIAL_SESSION = {
        judge: undefined,
      } as RawTrialSession;
      const UPDATED_TRIAL_SESSION = {
        judge: undefined,
      } as TrialSession;

      const results = await shouldCreateWorkingCopyForNewJudge(
        CURRENT_TRIAL_SESSION,
        UPDATED_TRIAL_SESSION,
      );

      expect(results).toEqual(false);
    });
  });

  describe('shouldCreateWorkingCopyForNewTrialClerk', () => {
    it('should return "true" when trial clerk id changed from an existing one to another', async () => {
      const CURRENT_TRIAL_SESSION = {
        trialClerk: {
          userId: 'current-user-id',
        },
      } as RawTrialSession;
      const UPDATED_TRIAL_SESSION = {
        trialClerk: {
          userId: 'updated-user-id',
        },
      } as TrialSession;

      const results = await shouldCreateWorkingCopyForNewTrialClerk(
        CURRENT_TRIAL_SESSION,
        UPDATED_TRIAL_SESSION,
      );

      expect(results).toEqual(true);
    });

    it('should return "true" when there was no trial clerk user id to begin with and then one assigned', async () => {
      const CURRENT_TRIAL_SESSION = {
        trialClerk: undefined,
      } as RawTrialSession;
      const UPDATED_TRIAL_SESSION = {
        trialClerk: {
          userId: 'updated-user-id',
        },
      } as TrialSession;

      const results = await shouldCreateWorkingCopyForNewTrialClerk(
        CURRENT_TRIAL_SESSION,
        UPDATED_TRIAL_SESSION,
      );

      expect(results).toEqual(true);
    });

    it('should return "false" when trial clerk id did not changed at all', async () => {
      const CURRENT_TRIAL_SESSION = {
        trialClerk: {
          userId: 'current-user-id',
        },
      } as RawTrialSession;
      const UPDATED_TRIAL_SESSION = {
        trialClerk: {
          userId: 'current-user-id',
        },
      } as TrialSession;

      const results = await shouldCreateWorkingCopyForNewTrialClerk(
        CURRENT_TRIAL_SESSION,
        UPDATED_TRIAL_SESSION,
      );

      expect(results).toEqual(false);
    });

    it('should return "false" when there is no trial clerk id at all', async () => {
      const CURRENT_TRIAL_SESSION = {
        trialClerk: undefined,
      } as RawTrialSession;
      const UPDATED_TRIAL_SESSION = {
        trialClerk: undefined,
      } as TrialSession;

      const results = await shouldCreateWorkingCopyForNewTrialClerk(
        CURRENT_TRIAL_SESSION,
        UPDATED_TRIAL_SESSION,
      );

      expect(results).toEqual(false);
    });
  });
});
