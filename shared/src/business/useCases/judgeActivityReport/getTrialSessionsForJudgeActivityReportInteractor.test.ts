import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import { SESSION_TYPES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { docketClerkUser, judgeUser } from '../../../test/mockUsers';
import { getTrialSessionsForJudgeActivityReportInteractor } from './getTrialSessionsForJudgeActivityReportInteractor';

describe('getTrialSessionsForJudgeActivityReportInteractor', () => {
  const judgeUsers = [
    judgeUser,
    {
      ...judgeUser,
      judgeFullName: 'George Buch',
      name: 'Buch',
      userId: 'd3222-f6cd-442c-a168-202db587f16f',
    },
    {
      ...judgeUser,
      judgeFullName: 'Kevin Colvin',
      name: 'Colvin',
      userId: '55555-f6cd-442c-a168-202db5876666',
    },
  ];

  const mockStartDate = '2020-03-22T03:59:59.999Z';
  const mockEndDate = '2020-03-23T03:59:59.999Z';

  const mockTrialSessionsForAllJudges = judgeUsers.map(jdg => {
    const mockRegularTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      endDate: mockEndDate,
      judge: {
        name: jdg.name,
        userId: jdg.userId,
      },
      startDate: mockStartDate,
    };

    const mockMotionHearingTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      endDate: mockEndDate,
      judge: {
        name: jdg.name,
        userId: jdg.userId,
      },
      sessionType: SESSION_TYPES.motionHearing,
      startDate: mockStartDate,
    };

    const mockSmallSwingTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      endDate: mockEndDate,
      judge: {
        name: jdg.name,
        userId: jdg.userId,
      },
      sessionType: SESSION_TYPES.small,
      startDate: mockStartDate,
      swingSession: true,
      swingSessionId: '0875bab4-5bfe-4b3a-a62d-565d7d950bd9',
    };

    const mockHybridSwingTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      endDate: mockEndDate,
      judge: {
        name: jdg.name,
        userId: jdg.userId,
      },
      sessionType: SESSION_TYPES.hybrid,
      startDate: mockStartDate,
      swingSession: true,
      swingSessionId: '0875bab4-5bfe-4b3a-a62d-565d7d950bd9',
    };

    const mockHybridNonSwingTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      endDate: mockEndDate,
      judge: {
        name: jdg.name,
        userId: jdg.userId,
      },
      sessionType: SESSION_TYPES.hybrid,
      startDate: mockStartDate,
    };

    const mockHybridSmallSwingTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      endDate: mockEndDate,
      judge: {
        name: jdg.name,
        userId: jdg.userId,
      },
      sessionType: SESSION_TYPES.hybridSmall,
      startDate: mockStartDate,
      swingSession: true,
      swingSessionId: '0875bab4-5bfe-4b3a-a62d-565d7d950bd9',
    };

    const mockHybridSmallNonSwingTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      endDate: mockEndDate,
      judge: {
        name: jdg.name,
        userId: jdg.userId,
      },
      sessionType: SESSION_TYPES.hybridSmall,
      startDate: mockStartDate,
    };

    return [
      mockRegularTrialSession,
      mockMotionHearingTrialSession,
      mockSmallSwingTrialSession,
      mockHybridNonSwingTrialSession,
      mockHybridSwingTrialSession,
      mockHybridSmallSwingTrialSession,
      mockHybridSmallNonSwingTrialSession,
    ];
  });

  const judgesSelection = [
    judgeUsers[0].userId,
    judgeUsers[1].userId,
    judgeUsers[2].userId,
  ];

  const mockValidRequest = {
    endDate: mockEndDate,
    judgesSelection,
    startDate: mockStartDate,
  };

  const mockInvalidRequest = {
    endDate: '04/01/5000',
    judgesSelection,
    startDate: '01/01/2020',
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockReturnValueOnce(mockTrialSessionsForAllJudges[0]);
  });

  it('should throw an error when user is unauthorized to retrieve the judge activity report', async () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    await expect(
      getTrialSessionsForJudgeActivityReportInteractor(
        applicationContext,
        mockValidRequest,
      ),
    ).rejects.toThrow();
  });

  it('should throw an error when the search request is not valid', async () => {
    const mockInvalidRequestWithInvalidJudgesSelection = {
      ...mockValidRequest,
      judgesSelection: [],
    };
    await expect(
      getTrialSessionsForJudgeActivityReportInteractor(
        applicationContext,
        mockInvalidRequest,
      ),
    ).rejects.toThrow();

    await expect(
      getTrialSessionsForJudgeActivityReportInteractor(
        applicationContext,
        mockInvalidRequestWithInvalidJudgesSelection,
      ),
    ).rejects.toThrow();
  });

  it('should retrieve all trial sessions from persistence for filtering', async () => {
    await getTrialSessionsForJudgeActivityReportInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(
      applicationContext.getPersistenceGateway().getTrialSessions,
    ).toHaveBeenCalledTimes(3);
  });

  it('should return for each trial session type, the weighted count of sessions held in the date range for the judge provided', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockReturnValueOnce(mockTrialSessionsForAllJudges[1]);
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockReturnValue(mockTrialSessionsForAllJudges[2]);
    const result = await getTrialSessionsForJudgeActivityReportInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result).toEqual({
      Hybrid: 9, // .5 for each swing hybrid, 1 for each non-swing, .5 for each swing hybrid small, 1 for each non-swing hybrid small
      'Motion/Hearing': 1.5, // .5 for each motion/hearing whose start date is within the date range AND session status is not new
      Regular: 3,
      Small: 1.5, // .5 for each R/S/H that is a part of a swing session
      Special: 0,
    });
  });
});
