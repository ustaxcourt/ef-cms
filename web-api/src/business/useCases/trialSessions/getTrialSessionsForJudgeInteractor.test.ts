import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getTrialSessionsForJudgeInteractor } from './getTrialSessionsForJudgeInteractor';

const MOCK_TRIAL_SESSION = {
  maxCases: 100,
  proceedingType: 'Remote',
  sessionType: 'Regular',
  startDate: '3000-03-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2009',
  trialLocation: 'Birmingham, Alabama',
};

const JUDGE_ID = 'abc';

describe('getTrialSessionsForJudgeInteractor', () => {
  it('throws error if user is unauthorized', async () => {
    applicationContext.getUniqueId.mockReturnValue(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );

    await expect(
      getTrialSessionsForJudgeInteractor(applicationContext, JUDGE_ID),
    ).rejects.toThrow();
  });

  it('should only return trial sessions associated with the judgeId', async () => {
    applicationContext.getCurrentUser.mockImplementation(() => {
      return {
        role: ROLES.petitionsClerk,
        userId: 'petitionsclerk',
      };
    });
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockResolvedValue([
        MOCK_TRIAL_SESSION,
        {
          ...MOCK_TRIAL_SESSION,
          judge: {
            userId: JUDGE_ID,
          },
        },
      ]);

    const trialSessions = await getTrialSessionsForJudgeInteractor(
      applicationContext,
      JUDGE_ID,
    );

    expect(trialSessions.length).toEqual(1);
  });
});
