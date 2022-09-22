import {
  ROLES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { User } from '../../../../shared/src/business/entities/User';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from 'cerebral/test';
import { trialSessionHeaderHelper as trialSessionHeaderHelperComputed } from './trialSessionHeaderHelper';
import { withAppContextDecorator } from '../../withAppContext';

describe('trialSessionHeaderHelper', () => {
  const trialSessionHeaderHelper = withAppContextDecorator(
    trialSessionHeaderHelperComputed,
    {
      ...applicationContext,
    },
  );

  const mockJudgeUser = new User({
    name: 'Trial Judge',
    role: ROLES.judge,
    userId: '8979ce01-bb0f-43ec-acee-fb3c0e967f0d',
  });

  const mockTrialClerkUser = new User({
    name: 'Trial Clerk',
    role: ROLES.trialClerk,
    userId: '6a2bc4a9-6cd0-44bb-92e0-b7cd7404fa0d',
  });

  const baseState = { trialSession: {} };

  let mockFormattedTrialSession = {
    formattedJudge: 'Trial Judge',
    sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
  };

  beforeEach(() => {
    mockFormattedTrialSession = {
      formattedJudge: 'Trial Judge',
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
    };

    applicationContext
      .getUtilities()
      .formattedTrialSessionDetails.mockImplementation(
        () => mockFormattedTrialSession,
      );
  });

  it('should not throw an error when state.trialSession is undefined', () => {
    expect(() => runCompute(trialSessionHeaderHelper, {})).not.toThrow();
  });

  describe('isStandaloneSession', () => {
    it('should be set to the result of a call to applicationContext.getUtilities().isStandaloneRemoteSession', () => {
      const mockIsStandaloneSession = true;
      applicationContext
        .getUtilities()
        .isStandaloneRemoteSession.mockReturnValue(mockIsStandaloneSession);
      mockFormattedTrialSession = {
        ...mockFormattedTrialSession,
        sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
      };

      const { isStandaloneSession } = runCompute(trialSessionHeaderHelper, {
        state: baseState,
      });

      expect(
        applicationContext.getUtilities().isStandaloneRemoteSession,
      ).toHaveBeenCalledWith(mockFormattedTrialSession.sessionScope);
      expect(isStandaloneSession).toEqual(mockIsStandaloneSession);
    });
  });

  describe('nameToDisplay', () => {
    it("should be the assigned judge's name when the current user is NOT a trial clerk", () => {
      applicationContext.getCurrentUser.mockReturnValue(mockJudgeUser);

      const result = runCompute(trialSessionHeaderHelper, {
        state: baseState,
      });

      expect(result.nameToDisplay).toBe(
        mockFormattedTrialSession.formattedJudge,
      );
    });

    it("should be the current user's name when the current user is a trial clerk", () => {
      applicationContext.getCurrentUser.mockReturnValue(mockTrialClerkUser);

      const result = runCompute(trialSessionHeaderHelper, {
        state: baseState,
      });

      expect(result.nameToDisplay).toBe(mockTrialClerkUser.name);
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

  describe('showSwitchToSessionDetail', () => {
    it('should be false when the user is a judge, they are on the TrialSessionWorkingCopy screen, but they are not assigned to the trial session', () => {
      const result = runCompute(trialSessionHeaderHelper, {
        state: {
          ...baseState,
          currentPage: 'TrialSessionWorkingCopy',
          judgeUser: { userId: mockJudgeUser.userId },
          trialSession: {
            judge: { userId: 'NOT_ASSIGNED' },
          },
        },
      });

      expect(result.showSwitchToSessionDetail).toBe(false);
    });

    it('should be false when the user is a trial clerk, they are on the TrialSessionWorkingCopy screen, but they are not assigned to the trial session', () => {
      applicationContext.getCurrentUser.mockReturnValue(mockTrialClerkUser);

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
      applicationContext.getCurrentUser.mockReturnValue(mockTrialClerkUser);

      const result = runCompute(trialSessionHeaderHelper, {
        state: {
          ...baseState,
          currentPage: 'TrialSessionDetail',
          trialSession: {
            trialClerk: { userId: mockTrialClerkUser.userId },
          },
        },
      });

      expect(result.showSwitchToSessionDetail).toBe(false);
    });

    it('should be true when the user is assigned to the session and they are on the TrialSessionWorkingCopy screen', () => {
      applicationContext.getCurrentUser.mockReturnValue(mockTrialClerkUser);

      const result = runCompute(trialSessionHeaderHelper, {
        state: {
          ...baseState,
          currentPage: 'TrialSessionWorkingCopy',
          trialSession: {
            trialClerk: { userId: mockTrialClerkUser.userId },
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
          judgeUser: { userId: mockJudgeUser.userId },
          trialSession: {
            judge: { userId: mockJudgeUser.userId },
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
          judgeUser: { userId: mockJudgeUser.userId },
          trialSession: {
            judge: { userId: 'NOT_ASSIGNED' },
          },
        },
      });

      expect(result.showSwitchToWorkingCopy).toBe(false);
    });

    it('should be false when the user is a trial clerk, they are on the TrialSessionDetail screen, but they are not assigned to the trial session', () => {
      applicationContext.getCurrentUser.mockReturnValue(mockTrialClerkUser);

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
      applicationContext.getCurrentUser.mockReturnValue(mockTrialClerkUser);

      const result = runCompute(trialSessionHeaderHelper, {
        state: {
          ...baseState,
          currentPage: 'TrialSessionWorkingCopy',
          trialSession: {
            trialClerk: { userId: mockTrialClerkUser.userId },
          },
        },
      });

      expect(result.showSwitchToWorkingCopy).toBe(false);
    });

    it('should be true when the user is a trial clerk assigned to the session and they are on the TrialSessionDetail screen', () => {
      applicationContext.getCurrentUser.mockReturnValue(mockTrialClerkUser);

      const result = runCompute(trialSessionHeaderHelper, {
        state: {
          ...baseState,
          currentPage: 'TrialSessionDetail',
          trialSession: {
            trialClerk: { userId: mockTrialClerkUser.userId },
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
          judgeUser: { userId: mockJudgeUser.userId },
          trialSession: {
            judge: { userId: mockJudgeUser.userId },
          },
        },
      });

      expect(result.showSwitchToWorkingCopy).toBe(true);
    });
  });
});
