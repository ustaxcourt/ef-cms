import { MOCK_TRIAL_REGULAR } from '../../../../../shared/src/test/mockTrial';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { dismissNOTTReminderForTrialInteractor } from './dismissNOTTReminderForTrialInteractor';
import {
  mockDocketClerkUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('dismissNOTTReminderForTrialInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(MOCK_TRIAL_REGULAR);
  });

  it('should throw an error when the user is unauthorized to dismiss NOTT alerts', async () => {
    await expect(
      dismissNOTTReminderForTrialInteractor(
        applicationContext,
        {
          trialSessionId: MOCK_TRIAL_REGULAR.trialSessionId!,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Unauthorized to dismiss NOTT reminder');
  });

  it('should update the trial session with a flag indicating that the NOTT filing reminder has been dismissed', async () => {
    await dismissNOTTReminderForTrialInteractor(
      applicationContext,
      {
        trialSessionId: MOCK_TRIAL_REGULAR.trialSessionId!,
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate,
    ).toMatchObject({
      dismissedAlertForNOTT: true,
      trialSessionId: MOCK_TRIAL_REGULAR.trialSessionId,
    });
  });
});
