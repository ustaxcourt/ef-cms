import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { dismissNOTTReminderForTrialInteractor } from './dismissNOTTReminderForTrialInteractor';
import {
  mockDocketClerkUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { updateTrialSession as updateTrialSessionMock} from '@web-api/persistence/postgres/trialSessions/updateTrialSession';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';

describe('dismissNOTTReminderForTrialInteractor', () => {
  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
  const updateTrialSession = jest.mocked(updateTrialSessionMock);

  beforeEach(() => {
    getTrialSessionById.mockResolvedValue(MOCK_TRIAL_REGULAR);
  });

  it('should throw an error when the user is unauthorized to dismiss NOTT alerts', async () => {
    await expect(
      dismissNOTTReminderForTrialInteractor(
        {
          trialSessionId: MOCK_TRIAL_REGULAR.trialSessionId!,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Unauthorized to dismiss NOTT reminder');
  });

  it('should update the trial session with a flag indicating that the NOTT filing reminder has been dismissed', async () => {
    await dismissNOTTReminderForTrialInteractor(
      {
        trialSessionId: MOCK_TRIAL_REGULAR.trialSessionId!,
      },
      mockPetitionsClerkUser,
    );

    expect(
      updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate,
    ).toMatchObject({
      dismissedAlertForNott: true,
      trialSessionId: MOCK_TRIAL_REGULAR.trialSessionId,
    });
  });
});
