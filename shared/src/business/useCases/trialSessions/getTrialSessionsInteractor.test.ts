import {
  MOCK_TRIAL_INPERSON,
  MOCK_TRIAL_REGULAR,
} from '../../../test/mockTrial';
import { TrialSessionInfoDTO } from '../../dto/trialSessions/TrialSessionInfoDTO';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getTrialSessionsInteractor } from './getTrialSessionsInteractor';
import { omit } from 'lodash';
import { petitionerUser, petitionsClerkUser } from '../../../test/mockUsers';

describe('getTrialSessionsInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);
  });

  it('should throw an unauthorized error when the user does not have permission to view trial sessions', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    await expect(
      getTrialSessionsInteractor(applicationContext),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
  });

  it('should throw an error when the entity returned from persistence is invalid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockResolvedValue([
        omit(MOCK_TRIAL_INPERSON, 'maxCases'),
      ]);

    await expect(
      getTrialSessionsInteractor(applicationContext),
    ).rejects.toThrow('The TrialSession entity was invalid.');
  });

  it('should return a list of validated trial sessions', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockResolvedValue([
        MOCK_TRIAL_INPERSON,
        MOCK_TRIAL_REGULAR,
      ]);

    const trialSessionDTOs =
      await getTrialSessionsInteractor(applicationContext);

    trialSessionDTOs.forEach(trialSessionDTO => {
      expect(trialSessionDTO instanceof TrialSessionInfoDTO).toBe(true);
    });
  });
});
