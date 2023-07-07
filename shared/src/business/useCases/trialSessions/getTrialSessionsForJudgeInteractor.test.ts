import { MOCK_TRIAL_REMOTE } from '../../../test/mockTrial';
import { ROLES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getTrialSessionsForJudgeInteractor } from './getTrialSessionsForJudgeInteractor';

describe('getTrialSessionsForJudgeInteractor', () => {
  const JUDGE_ID = 'abc';
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
        MOCK_TRIAL_REMOTE,
        {
          ...MOCK_TRIAL_REMOTE,
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
