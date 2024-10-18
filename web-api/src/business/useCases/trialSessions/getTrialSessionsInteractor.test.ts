import {
  MOCK_TRIAL_INPERSON,
  MOCK_TRIAL_REGULAR,
} from '../../../../../shared/src/test/mockTrial';
import { TrialSessionInfoDTO } from '../../../../../shared/src/business/dto/trialSessions/TrialSessionInfoDTO';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getTrialSessionsInteractor } from './getTrialSessionsInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('getTrialSessionsInteractor', () => {
  it('should throw an unauthorized error when the user does not have permission to view trial sessions', async () => {
    await expect(
      getTrialSessionsInteractor(applicationContext, mockPetitionerUser),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
  });

  it('should return a list of trial sessions', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockResolvedValue([
        MOCK_TRIAL_INPERSON,
        MOCK_TRIAL_REGULAR,
      ]);

    const trialSessionDTOs = await getTrialSessionsInteractor(
      applicationContext,
      mockPetitionsClerkUser,
    );

    trialSessionDTOs.forEach(trialSessionDTO => {
      expect(trialSessionDTO instanceof TrialSessionInfoDTO).toBe(true);
    });
  });
});
