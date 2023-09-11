import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  colvinsChambersUser,
  judgeUser,
  petitionsClerkUser,
  trialClerkUser,
} from '../../../../shared/src/test/mockUsers';
import { getUserIsAssignedToSession } from './formattedCaseDetail';
import { runCompute } from '@web-client/presenter/test.cerebral';

const JUDGES_CHAMBERS = applicationContext
  .getPersistenceGateway()
  .getJudgesChambers();

describe('formattedCaseDetail getUserIsAssignedToSession', () => {
  const mockTrialSessionId = applicationContext.getUniqueId();

  it("should be true when the case's trial session judge is the currently logged in user", () => {
    const result = runCompute(
      get =>
        getUserIsAssignedToSession({
          currentUser: judgeUser,
          get,
          trialSessionId: mockTrialSessionId,
        }),
      {
        state: {
          trialSessions: [
            {
              judge: {
                userId: judgeUser.userId,
              },
              trialSessionId: mockTrialSessionId,
            },
          ],
        },
      },
    );

    expect(result).toBeTruthy();
  });

  it("should be false when the case's trial session judge is not the currently logged in user", () => {
    const result = runCompute(
      get =>
        getUserIsAssignedToSession({
          currentUser: petitionsClerkUser,
          get,
          trialSessionId: mockTrialSessionId,
        }),
      {
        state: {
          trialSessions: [
            {
              judge: {
                userId: judgeUser.userId,
              },
              trialSessionId: mockTrialSessionId,
            },
          ],
        },
      },
    );

    expect(result).toBeFalsy();
  });

  it('should be true when the current user is a chambers user for the judge assigned to the trial session the case is scheduled for', () => {
    const result = runCompute(
      get =>
        getUserIsAssignedToSession({
          currentUser: colvinsChambersUser,
          get,
          trialSessionId: mockTrialSessionId,
        }),
      {
        state: {
          judgeUser: {
            section: colvinsChambersUser.section,
            userId: judgeUser.userId,
          },
          trialSessions: [
            {
              judge: {
                userId: judgeUser.userId,
              },
              trialSessionId: mockTrialSessionId,
            },
          ],
        },
      },
    );

    expect(result).toBeTruthy();
  });

  it('should be false when the current user is a chambers user for a different judge than the one assigned to the case', () => {
    const result = runCompute(
      get =>
        getUserIsAssignedToSession({
          currentUser: colvinsChambersUser,
          get,
          trialSessionId: mockTrialSessionId,
        }),
      {
        state: {
          judgeUser: {
            section: JUDGES_CHAMBERS.BUCHS_CHAMBERS_SECTION.section,
            userId: judgeUser.userId,
          },
          trialSessions: [
            {
              judge: {
                userId: judgeUser.userId,
              },
              trialSessionId: mockTrialSessionId,
            },
          ],
        },
      },
    );

    expect(result).toBeFalsy();
  });

  it('should be true when the current user is the trial clerk assigned to the trial session the case is scheduled for', () => {
    const result = runCompute(
      get =>
        getUserIsAssignedToSession({
          currentUser: trialClerkUser,
          get,
          trialSessionId: mockTrialSessionId,
        }),
      {
        state: {
          trialSessions: [
            {
              trialClerk: {
                userId: trialClerkUser.userId,
              },
              trialSessionId: mockTrialSessionId,
            },
          ],
        },
      },
    );

    expect(result).toBeTruthy();
  });

  it('should be false when the current user is a trial clerk and is not assigned to the trial session the case is scheduled for', () => {
    const result = runCompute(
      get =>
        getUserIsAssignedToSession({
          currentUser: trialClerkUser,
          get,
          trialSessionId: mockTrialSessionId,
        }),
      {
        state: {
          trialSessions: [
            {
              trialClerk: {},
              trialSessionId: mockTrialSessionId,
            },
          ],
        },
      },
    );

    expect(result).toBeFalsy();
  });
});
