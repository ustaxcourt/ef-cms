import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getTrialSessionsForJudgeInteractor } from './getTrialSessionsForJudgeInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

const MOCK_TRIAL_SESSION = {
  maxCases: 100,
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
  sessionType: SESSION_TYPES.regular,
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
      getTrialSessionsForJudgeInteractor(
        applicationContext,
        JUDGE_ID,
        mockPetitionerUser,
      ),
    ).rejects.toThrow();
  });

  it('should only return trial sessions associated with the judgeId', async () => {
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
      mockPetitionsClerkUser,
    );

    expect(trialSessions.length).toEqual(1);
  });
});
