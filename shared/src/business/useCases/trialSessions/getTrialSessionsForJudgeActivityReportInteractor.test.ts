// import { ROLES } from '../../entities/EntityConstants';
import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import { applicationContext } from '../../test/createTestApplicationContext';
import { docketClerkUser, judgeUser } from '../../../test/mockUsers';
import { getTrialSessionsForJudgeActivityReportInteractor } from './getTrialSessionsForJudgeActivityReportInteractor';

describe('getTrialSessionsForJudgeActivityReportInteractor', () => {
  const mockRegularTrialSession = {
    ...MOCK_TRIAL_REGULAR,
    endDate: '2020-03-02T00:00:00.000Z',
    judge: {
      name: judgeUser.name,
      userId: judgeUser.userId,
    },
    startDate: '2020-03-01T00:00:00.000Z',
  };

  const mockTrialSessions = [mockRegularTrialSession];

  const mockValidRequest = {
    endDate: '04/01/2020',
    judgeId: judgeUser.userId,
    startDate: '01/01/2020',
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockReturnValue(mockTrialSessions);
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

  it('should retrieve all trial sessions from persistence for filtering', async () => {
    await getTrialSessionsForJudgeActivityReportInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(
      applicationContext.getPersistenceGateway().getTrialSessions,
    ).toHaveBeenCalled();
  });

  it('should return filtered trial session types with counts', async () => {
    const result = await getTrialSessionsForJudgeActivityReportInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result).toEqual({
      Hybrid: 0,
      'Motion/Hearing': 0,
      Regular: 1,
      Small: 0,
      Special: 0,
    });
  });
});
