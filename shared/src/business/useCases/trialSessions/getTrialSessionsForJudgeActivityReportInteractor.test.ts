// import { ROLES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { docketClerkUser, judgeUser } from '../../../test/mockUsers';
import { getTrialSessionsForJudgeActivityReportInteractor } from './getTrialSessionsForJudgeActivityReportInteractor';

const MOCK_TRIAL_SESSION = {
  ...MOCK_TRIAL_REGULAR,
  judge: {
    name: judgeUser.name,
    userId: judgeUser.userId,
  },
  //add start and end date within the range of mock valid request
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
});
