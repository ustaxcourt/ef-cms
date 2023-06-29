import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import { applicationContext } from '../../test/createTestApplicationContext';
import { dismissNOTTReminderForTrialInteractor } from './dismissNOTTReminderForTrialInteractor';
import { docketClerkUser, petitionsClerkUser } from '../../../test/mockUsers';

describe('dismissNOTTReminderForTrialInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(MOCK_TRIAL_REGULAR);
  });

  it('should throw an error when the user is unauthorized to dismiss NOTT alerts', async () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    await expect(
      dismissNOTTReminderForTrialInteractor(applicationContext, {
        trialSessionId: MOCK_TRIAL_REGULAR.trialSessionId,
      }),
    ).rejects.toThrow('Unauthorized to dismiss NOTT reminder');
  });

  it('should update the trial session with a flag indicating that the NOTT filing reminder has been dismissed', async () => {
    await dismissNOTTReminderForTrialInteractor(applicationContext, {
      trialSessionId: MOCK_TRIAL_REGULAR.trialSessionId,
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate,
    ).toMatchObject({
      dismissedAlertForNOTT: true,
      trialSessionId: MOCK_TRIAL_REGULAR.trialSessionId,
    });
  });
});
