import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import {
  MOCK_TRIAL_INPERSON,
  MOCK_TRIAL_REGULAR,
} from '@shared/test/mockTrial';
import { getTrialSessions as getTrialSessionsMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessions';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getTrialSessionsInteractor } from './getTrialSessionsInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('getTrialSessionsInteractor', () => {
  const getTrialSessions = jest.mocked(getTrialSessionsMock);

  it('should throw an unauthorized error when the user does not have permission to view trial sessions', async () => {
    await expect(
      getTrialSessionsInteractor(mockPetitionerUser),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
  });

  it('should return a list of trial sessions', async () => {
    getTrialSessions.mockResolvedValue([
        MOCK_TRIAL_INPERSON,
        MOCK_TRIAL_REGULAR,
      ]);

    const trialSessionDTOs = await getTrialSessionsInteractor(
      mockPetitionsClerkUser,
    );

    trialSessionDTOs.forEach(trialSessionDTO => {
      expect(trialSessionDTO instanceof TrialSessionInfoDTO).toBe(true);
    });
  });
});
