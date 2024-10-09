import { JudgeActivityStatisticsRequest } from '@web-api/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getTrialSessionsForJudgeActivityReportInteractor } from './getTrialSessionsForJudgeActivityReportInteractor';
import { judgeUser } from '@shared/test/mockUsers';
import { mockDocketClerkUser, mockJudgeUser } from '@shared/test/mockAuthUsers';

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

  const mockValidRequest: JudgeActivityStatisticsRequest = {
    endDate: '04/01/2020',
    judgeIds: [judgeUser.userId],
    startDate: '01/01/2020',
  };

  const mockInvalidRequest = {
    endDate: '04/01/5000',
    judgeIds: [judgeUser.userId],
    startDate: '01/01/2020',
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockReturnValue(mockTrialSessionsForAllJudges);
  });

  it('should throw an error when user is unauthorized to retrieve the judge activity report', async () => {
    await expect(
      getTrialSessionsForJudgeActivityReportInteractor(
        applicationContext,
        mockValidRequest,
        mockDocketClerkUser,
      ),
    ).rejects.toThrow();
  });

  it('should throw an error when the search request is not valid', async () => {
    await expect(
      getTrialSessionsForJudgeActivityReportInteractor(
        applicationContext,
        mockInvalidRequest,
        mockJudgeUser,
      ),
    ).rejects.toThrow();
  });

  it('should retrieve all trial sessions from persistence for filtering', async () => {
    await getTrialSessionsForJudgeActivityReportInteractor(
      applicationContext,
      mockValidRequest,
      mockJudgeUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getTrialSessions,
    ).toHaveBeenCalled();
  });

  it('should return for each trial session type, the weighted count of sessions held in the date range for the judge provided', async () => {
    const opinions = await getTrialSessionsForJudgeActivityReportInteractor(
      applicationContext,
      mockValidRequest,
      mockJudgeUser,
    );

    expect(opinions).toEqual({
      aggregations: {
        Hybrid: 3, // .5 for swing hybrid, 1 for non-swing, .5 for swing hybrid small, 1 for non-swing hybrid small
        'Motion/Hearing': 0.5, // .5 for each motion/hearing whose start date is within the date range AND session status is not new
        Regular: 1,
        Small: 0.5, // .5 for each R/S/H that is a part of a swing session
        Special: 0,
      },
      total: 5,
    });
  });

  it('should return ALL trial session types, the weighted count of sessions held in the date range for all the judges', async () => {
    const request = { ...mockValidRequest, judges: ['Colvin', 'Sotomayor'] };
    const result = await getTrialSessionsForJudgeActivityReportInteractor(
      applicationContext,
      request,
      mockJudgeUser,
    );

    expect(result).toEqual({
      aggregations: {
        Hybrid: 6, // .5 for swing hybrid, 1 for non-swing, .5 for swing hybrid small, 1 for non-swing hybrid small
        'Motion/Hearing': 1, // .5 for each motion/hearing whose start date is within the date range AND session status is not new
        Regular: 2,
        Small: 1, // .5 for each R/S/H that is a part of a swing session
        Special: 0,
      },
      total: 10,
    });
  });

  it('should not count unassigned trial sessions for a particular judge', async () => {
    const request = { ...mockValidRequest, judges: ['Colvin'] };
    const unassignedTrialSession: RawTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      judge: undefined,
      sessionType: SESSION_TYPES.special,
      startDate: '2020-03-01T00:00:00.000Z',
    };
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockResolvedValue([unassignedTrialSession]);

    const result = await getTrialSessionsForJudgeActivityReportInteractor(
      applicationContext,
      request,
      mockJudgeUser,
    );

    expect(result).toEqual({
      aggregations: {
        Hybrid: 0,
        'Motion/Hearing': 0,
        Regular: 0,
        Small: 0,
        Special: 0,
      },
      total: 0,
    });
  });

  it('should not count trial sessions whose start date is past the end date range', async () => {
    const request = {
      ...mockValidRequest,
      endDate: '03/02/2020',
      judges: [MOCK_TRIAL_REGULAR.judge?.name!],
    };
    const dayAfterTrialSession: RawTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      startDate: '2020-03-03T00:00:00.000-05:00',
    };
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockResolvedValue([dayAfterTrialSession]);

    const result = await getTrialSessionsForJudgeActivityReportInteractor(
      applicationContext,
      request,
      mockJudgeUser,
    );

    expect(result).toEqual({
      aggregations: {
        Hybrid: 0,
        'Motion/Hearing': 0,
        Regular: 0,
        Small: 0,
        Special: 0,
      },
      total: 0,
    });
  });

  it('should not count trial sessions whose start date is before the start date range', async () => {
    const request = {
      ...mockValidRequest,
      judges: [MOCK_TRIAL_REGULAR.judge?.name!],
      startDate: '03/02/2020',
    };
    const dayAfterTrialSession: RawTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      startDate: '2020-03-02T04:59:59.000Z',
    };
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockResolvedValue([dayAfterTrialSession]);

    const result = await getTrialSessionsForJudgeActivityReportInteractor(
      applicationContext,
      request,
      mockJudgeUser,
    );

    expect(result).toEqual({
      aggregations: {
        Hybrid: 0,
        'Motion/Hearing': 0,
        Regular: 0,
        Small: 0,
        Special: 0,
      },
      total: 0,
    });
  });
});
