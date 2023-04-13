// import { ROLES } from '../../entities/EntityConstants';
import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import { applicationContext } from '../../test/createTestApplicationContext';
import { docketClerkUser, judgeUser } from '../../../test/mockUsers';
import { getTrialSessionsForJudgeActivityReportInteractor } from './getTrialSessionsForJudgeActivityReportInteractor';

const MOCK_TRIAL_SESSION = {
  ...MOCK_TRIAL_REGULAR,
  endDate: '03/31/2020',
  judge: {
    name: judgeUser.name,
    userId: judgeUser.userId,
  },
  startDate: '03/30/2020',
};

const mockTrialSessions = [MOCK_TRIAL_SESSION];

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

describe('getTrialSessionsForJudgeActivityReportInteractor', () => {
  it('throws error if user is unauthorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    await expect(
      getTrialSessionsForJudgeActivityReportInteractor(
        applicationContext,
        mockValidRequest,
      ),
    ).rejects.toThrow();
  });

  it('should retrieve all trial sessions for filtering', async () => {
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
      Regular: 0,
      Small: 0,
      Special: 0,
    });
  });
});
