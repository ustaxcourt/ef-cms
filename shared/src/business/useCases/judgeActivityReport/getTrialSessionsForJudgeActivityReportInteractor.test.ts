import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import {
  SESSION_TYPES,
  TEMP_JUDGE_ID_TO_REPRESENT_ALL_JUDGES_SELECTION,
} from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { docketClerkUser, judgeUser } from '../../../test/mockUsers';
import { getTrialSessionsForJudgeActivityReportInteractor } from './getTrialSessionsForJudgeActivityReportInteractor';

describe('getTrialSessionsForJudgeActivityReportInteractor', () => {
  const mockJudges = [
    judgeUser,
    { ...judgeUser, name: 'Colvin', userId: '1234' },
  ];

  const mockTrialSessionsForAllJudges = [] as any;
  mockJudges.forEach(mockJudge => {
    const mockRegularTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      endDate: '2020-03-02T00:00:00.000Z',
      judge: {
        name: mockJudge.name,
        userId: mockJudge.userId,
      },
      startDate: '2020-03-01T00:00:00.000Z',
    };

    const mockMotionHearingTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      endDate: '2020-03-03T00:00:00.000Z',
      judge: {
        name: mockJudge.name,
        userId: mockJudge.userId,
      },
      sessionType: SESSION_TYPES.motionHearing,
      startDate: '2020-03-02T00:00:00.000Z',
    };

    const mockSmallSwingTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      endDate: '2020-03-03T00:00:00.000Z',
      judge: {
        name: mockJudge.name,
        userId: mockJudge.userId,
      },
      sessionType: SESSION_TYPES.small,
      startDate: '2020-03-02T00:00:00.000Z',
      swingSession: true,
      swingSessionId: '0875bab4-5bfe-4b3a-a62d-565d7d950bd9',
    };

    const mockHybridSwingTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      endDate: '2020-03-03T00:00:00.000Z',
      judge: {
        name: mockJudge.name,
        userId: mockJudge.userId,
      },
      sessionType: SESSION_TYPES.hybrid,
      startDate: '2020-03-02T00:00:00.000Z',
      swingSession: true,
      swingSessionId: '0875bab4-5bfe-4b3a-a62d-565d7d950bd9',
    };

    const mockHybridNonSwingTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      endDate: '2020-03-03T00:00:00.000Z',
      judge: {
        name: mockJudge.name,
        userId: mockJudge.userId,
      },
      sessionType: SESSION_TYPES.hybrid,
      startDate: '2020-03-02T00:00:00.000Z',
    };

    const mockHybridSmallSwingTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      endDate: '2020-03-03T00:00:00.000Z',
      judge: {
        name: mockJudge.name,
        userId: mockJudge.userId,
      },
      sessionType: SESSION_TYPES.hybridSmall,
      startDate: '2020-03-02T00:00:00.000Z',
      swingSession: true,
      swingSessionId: '0875bab4-5bfe-4b3a-a62d-565d7d950bd9',
    };

    const mockHybridSmallNonSwingTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      endDate: '2020-03-03T00:00:00.000Z',
      judge: {
        name: mockJudge.name,
        userId: mockJudge.userId,
      },
      sessionType: SESSION_TYPES.hybridSmall,
      startDate: '2020-03-02T00:00:00.000Z',
    };

    mockTrialSessionsForAllJudges.push(mockHybridNonSwingTrialSession);
    mockTrialSessionsForAllJudges.push(mockHybridSmallNonSwingTrialSession);
    mockTrialSessionsForAllJudges.push(mockHybridSmallSwingTrialSession);
    mockTrialSessionsForAllJudges.push(mockHybridSwingTrialSession);
    mockTrialSessionsForAllJudges.push(mockMotionHearingTrialSession);
    mockTrialSessionsForAllJudges.push(mockRegularTrialSession);
    mockTrialSessionsForAllJudges.push(mockSmallSwingTrialSession);
  });

  const mockValidRequest = {
    endDate: '04/01/2020',
    judgeId: judgeUser.userId,
    startDate: '01/01/2020',
  };

  const mockInvalidRequest = {
    endDate: '04/01/5000',
    judgeId: judgeUser.userId,
    startDate: '01/01/2020',
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockReturnValue(mockTrialSessionsForAllJudges);
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
    await expect(
      getTrialSessionsForJudgeActivityReportInteractor(
        applicationContext,
        mockInvalidRequest,
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
    ).toHaveBeenCalled();
  });

  it('should return for each trial session type, the weighted count of sessions held in the date range for the judge provided', async () => {
    const result = await getTrialSessionsForJudgeActivityReportInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result).toEqual({
      Hybrid: 3, // .5 for swing hybrid, 1 for non-swing, .5 for swing hybrid small, 1 for non-swing hybrid small
      'Motion/Hearing': 0.5, // .5 for each motion/hearing whose start date is within the date range AND session status is not new
      Regular: 1,
      Small: 0.5, // .5 for each R/S/H that is a part of a swing session
      Special: 0,
    });
  });

  it('should return all trial session type, the weighted count of sessions held in the date range for all the judges', async () => {
    mockValidRequest.judgeId = TEMP_JUDGE_ID_TO_REPRESENT_ALL_JUDGES_SELECTION;

    const result = await getTrialSessionsForJudgeActivityReportInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result).toEqual({
      Hybrid: 6, // .5 for swing hybrid, 1 for non-swing, .5 for swing hybrid small, 1 for non-swing hybrid small
      'Motion/Hearing': 1, // .5 for each motion/hearing whose start date is within the date range AND session status is not new
      Regular: 2,
      Small: 1, // .5 for each R/S/H that is a part of a swing session
      Special: 0,
    });
  });
});
