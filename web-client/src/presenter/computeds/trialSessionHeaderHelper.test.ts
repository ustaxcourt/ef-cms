import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { TRIAL_SESSION_SCOPE_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { judgeUser, trialClerkUser } from '@shared/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { trialSessionHeaderHelper as trialSessionHeaderHelperComputed } from './trialSessionHeaderHelper';
import { withAppContextDecorator } from '../../withAppContext';

describe('trialSessionHeaderHelper', () => {
  const trialSessionHeaderHelper = withAppContextDecorator(
    trialSessionHeaderHelperComputed,
    applicationContext,
  );

  const baseState = { trialSession: {} };

  let mockFormattedTrialSession;

  beforeEach(() => {
    mockFormattedTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      formattedJudge: 'Trial Judge',
    };

    applicationContext
      .getUtilities()
      .getFormattedTrialSessionDetails.mockImplementation(
        () => mockFormattedTrialSession,
      );
  });

  it('should not throw an error when state.trialSession is undefined', () => {
    expect(() => runCompute(trialSessionHeaderHelper, {} as any)).not.toThrow();
  });

  describe('isStandaloneSession', () => {
    it('should be true when the trial session scope is `Standalone Remote`', () => {
      mockFormattedTrialSession = {
        ...mockFormattedTrialSession,
        sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
      };

      const { isStandaloneSession } = runCompute(trialSessionHeaderHelper, {
        state: baseState,
      });

      expect(isStandaloneSession).toEqual(true);
    });
  });

  describe('nameToDisplay', () => {
    it("should be the assigned judge's name when the current user is NOT a trial clerk", () => {
      applicationContext.getCurrentUser.mockReturnValue(judgeUser);

      const result = runCompute(trialSessionHeaderHelper, {
        state: baseState,
      });

      expect(result.nameToDisplay).toBe(
        mockFormattedTrialSession.formattedJudge,
      );
    });

    it("should be the current user's name when the current user is a trial clerk", () => {
      applicationContext.getCurrentUser.mockReturnValue(trialClerkUser);

      const result = runCompute(trialSessionHeaderHelper, {
        state: baseState,
      });

      expect(result.nameToDisplay).toBe(trialClerkUser.name);
    });
  });

  describe('showBatchDownloadButton', () => {
    it('should be false when a trial session has no assigned cases', () => {
      mockFormattedTrialSession = {
        ...mockFormattedTrialSession,
        allCases: [],
      };

      const result = runCompute(trialSessionHeaderHelper, {
        state: baseState,
      });

      expect(result.showBatchDownloadButton).toBe(false);
    });

    it('should be true when at least one case has been added to the trial session', () => {
      mockFormattedTrialSession = {
        ...mockFormattedTrialSession,
        allCases: [{ docketNumber: '123-45' }],
      };

      const result = runCompute(trialSessionHeaderHelper, {
        state: baseState,
      });

      expect(result.showBatchDownloadButton).toBe(true);
    });
  });

  describe('showPrintCalendarButton', () => {
    it('should be true when the trial session is calendared', () => {
      mockFormattedTrialSession = {
        ...mockFormattedTrialSession,
        isCalendared: true,
      };

      const result = runCompute(trialSessionHeaderHelper, {
        state: baseState,
      });

      expect(result.showPrintCalendarButton).toBe(true);
    });
  });

  describe('showPrintPaperServicePDFsButton', () => {
    it('should be true when the trial session has at least one paper service pdf that can be reprinted and the user has permissions', () => {
      mockFormattedTrialSession = {
        ...mockFormattedTrialSession,
        paperServicePdfs: [
          {
            documentId: '4a65b373-0014-431f-bf9e-7d13c9a2b368',
            title: 'Initial Calendaring',
          },
        ],
      };

      const result = runCompute(trialSessionHeaderHelper, {
        state: { ...baseState, permissions: { TRIAL_SESSIONS: true } },
      });

      expect(result.showPrintPaperServicePDFsButton).toBe(true);
    });
  });

  describe('showSwitchToSessionDetail', () => {
    it('should be false when the user is a judge, they are on the TrialSessionWorkingCopy screen, but they are not assigned to the trial session', () => {
      const result = runCompute(trialSessionHeaderHelper, {
        state: {
          ...baseState,
          currentPage: 'TrialSessionWorkingCopy',
          judgeUser: { userId: judgeUser.userId },
          trialSession: {
            judge: { userId: 'NOT_ASSIGNED' },
          },
        },
      });

      expect(result.showSwitchToSessionDetail).toBe(false);
    });

    it('should be false when the user is a trial clerk, they are on the TrialSessionWorkingCopy screen, but they are not assigned to the trial session', () => {
      applicationContext.getCurrentUser.mockReturnValue(trialClerkUser);

      const result = runCompute(trialSessionHeaderHelper, {
        state: {
          ...baseState,
          currentPage: 'TrialSessionWorkingCopy',
          trialSession: {
            trialClerk: { userId: 'NOT_ASSIGNED' },
          },
        },
      });

      expect(result.showSwitchToSessionDetail).toBe(false);
    });

    it('should be false when the user is assigned to the session but they are already on the TrialSessionDetail screen', () => {
      applicationContext.getCurrentUser.mockReturnValue(trialClerkUser);

      const result = runCompute(trialSessionHeaderHelper, {
        state: {
          ...baseState,
          currentPage: 'TrialSessionDetail',
          trialSession: {
            trialClerk: { userId: trialClerkUser.userId },
          },
        },
      });

      expect(result.showSwitchToSessionDetail).toBe(false);
    });

    it('should be true when the user is assigned to the session and they are on the TrialSessionWorkingCopy screen', () => {
      applicationContext.getCurrentUser.mockReturnValue(trialClerkUser);

      const result = runCompute(trialSessionHeaderHelper, {
        state: {
          ...baseState,
          currentPage: 'TrialSessionWorkingCopy',
          trialSession: {
            trialClerk: { userId: trialClerkUser.userId },
          },
        },
      });

      expect(result.showSwitchToSessionDetail).toBe(true);
    });

    it('should be true when the user is a judge assigned to the session and they are on the TrialSessionWorkingCopy screen', () => {
      const result = runCompute(trialSessionHeaderHelper, {
        state: {
          ...baseState,
          currentPage: 'TrialSessionWorkingCopy',
          judgeUser: { userId: judgeUser.userId },
          trialSession: {
            judge: { userId: judgeUser.userId },
          },
        },
      });

      expect(result.showSwitchToSessionDetail).toBe(true);
    });
  });

  describe('showSwitchToWorkingCopy', () => {
    it('should be false when the user is a judge, they are on the TrialSessionDetail screen, but they are not assigned to the trial session', () => {
      const result = runCompute(trialSessionHeaderHelper, {
        state: {
          ...baseState,
          currentPage: 'TrialSessionDetail',
          judgeUser: { userId: judgeUser.userId },
          trialSession: {
            judge: { userId: 'NOT_ASSIGNED' },
          },
        },
      });

      expect(result.showSwitchToWorkingCopy).toBe(false);
    });

    it('should be false when the user is a trial clerk, they are on the TrialSessionDetail screen, but they are not assigned to the trial session', () => {
      applicationContext.getCurrentUser.mockReturnValue(trialClerkUser);

      const result = runCompute(trialSessionHeaderHelper, {
        state: {
          ...baseState,
          currentPage: 'TrialSessionDetail',
          trialSession: {
            trialClerk: { userId: 'NOT_ASSIGNED' },
          },
        },
      });

      expect(result.showSwitchToWorkingCopy).toBe(false);
    });

    it('should be false when the user is assigned to the session but they are already on the TrialSessionWorkingCopy screen', () => {
      applicationContext.getCurrentUser.mockReturnValue(trialClerkUser);

      const result = runCompute(trialSessionHeaderHelper, {
        state: {
          ...baseState,
          currentPage: 'TrialSessionWorkingCopy',
          trialSession: {
            trialClerk: { userId: trialClerkUser.userId },
          },
        },
      });

      expect(result.showSwitchToWorkingCopy).toBe(false);
    });

    it('should be true when the user is a trial clerk assigned to the session and they are on the TrialSessionDetail screen', () => {
      applicationContext.getCurrentUser.mockReturnValue(trialClerkUser);

      const result = runCompute(trialSessionHeaderHelper, {
        state: {
          ...baseState,
          currentPage: 'TrialSessionDetail',
          trialSession: {
            trialClerk: { userId: trialClerkUser.userId },
          },
        },
      });

      expect(result.showSwitchToWorkingCopy).toBe(true);
    });

    it('should be true when the user is a judge assigned to the session and they are on the TrialSessionDetail screen', () => {
      const result = runCompute(trialSessionHeaderHelper, {
        state: {
          ...baseState,
          currentPage: 'TrialSessionDetail',
          judgeUser: { userId: judgeUser.userId },
          trialSession: {
            judge: { userId: judgeUser.userId },
          },
        },
      });

      expect(result.showSwitchToWorkingCopy).toBe(true);
    });
  });
});
