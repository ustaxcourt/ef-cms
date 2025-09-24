import '@web-api/persistence/postgres/trialSessions/mocks.jest';
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
import { getTrialSessions as getTrialSessionsMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessions';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';

describe('getTrialSessionsForJudgeInteractor', () => {
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

  const getTrialSessions = jest.mocked(getTrialSessionsMock);
  it('throws error if user is unauthorized', async () => {
    applicationContext.getUniqueId.mockReturnValue(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );

    await expect(
      getTrialSessionsForJudgeInteractor(JUDGE_ID, mockPetitionerUser),
    ).rejects.toThrow();
  });

  it('should only return trial sessions associated with the judgeId', async () => {
    getTrialSessions.mockResolvedValue([
      MOCK_TRIAL_SESSION as RawTrialSession,
      {
        ...MOCK_TRIAL_SESSION,
        judge: {
          userId: JUDGE_ID,
        },
      } as RawTrialSession,
    ]);

    const trialSessions = await getTrialSessionsForJudgeInteractor(
      JUDGE_ID,
      mockPetitionsClerkUser,
    );

    expect(trialSessions.length).toEqual(1);
  });
});
