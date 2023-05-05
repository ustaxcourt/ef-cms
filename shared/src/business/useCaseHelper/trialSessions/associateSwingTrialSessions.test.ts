import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '../../entities/EntityConstants';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { applicationContext } from '../../test/createTestApplicationContext';
import { associateSwingTrialSessions } from './associateSwingTrialSessions';
import { petitionerUser, petitionsClerkUser } from '../../../test/mockUsers';

const MOCK_TRIAL_SESSION = {
  ...MOCK_TRIAL_REGULAR,
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
  sessionType: 'Regular',
  startDate: '3000-03-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '3000',
  trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
};

const MOCK_TRIAL_SESSION_FOR_ASSOCIATION = {
  ...MOCK_TRIAL_REGULAR,
  sessionType: 'Small',
  startDate: '3000-03-03T00:00:00.000Z',
  term: 'Fall',
  termYear: '3000',
  trialSessionId: '208a959f-9526-4db5-b262-e58c476a4604',
};

let mockCurrentTrialSessionEntity;

describe('associateSwingTrialSessions', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(MOCK_TRIAL_SESSION_FOR_ASSOCIATION);

    mockCurrentTrialSessionEntity = new TrialSession(MOCK_TRIAL_SESSION, {
      applicationContext,
    });
  });

  it('throws an error if user is unauthorized to associate swing sessions', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    await expect(
      associateSwingTrialSessions(applicationContext, {
        swingSessionId: MOCK_TRIAL_SESSION_FOR_ASSOCIATION.trialSessionId,
        trialSessionEntity: mockCurrentTrialSessionEntity,
      }),
    ).rejects.toThrow();
  });

  it('retrieves the swing session to be associated with the current session from persistence', async () => {
    await associateSwingTrialSessions(applicationContext, {
      swingSessionId: MOCK_TRIAL_SESSION_FOR_ASSOCIATION.trialSessionId,
      trialSessionEntity: mockCurrentTrialSessionEntity,
    });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById.mock
        .calls[0][0].trialSessionId,
    ).toEqual(MOCK_TRIAL_SESSION_FOR_ASSOCIATION.trialSessionId);
  });

  it('updates the trial session to be associated with swing session information', async () => {
    await associateSwingTrialSessions(applicationContext, {
      swingSessionId: MOCK_TRIAL_SESSION_FOR_ASSOCIATION.trialSessionId,
      trialSessionEntity: mockCurrentTrialSessionEntity,
    });

    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate,
    ).toMatchObject({
      ...MOCK_TRIAL_SESSION_FOR_ASSOCIATION,
      swingSession: true,
      swingSessionId: mockCurrentTrialSessionEntity.trialSessionId,
    });
  });

  it('sets swing session information on the current trial session', async () => {
    const updatedTrialSession = await associateSwingTrialSessions(
      applicationContext,
      {
        swingSessionId: MOCK_TRIAL_SESSION_FOR_ASSOCIATION.trialSessionId,
        trialSessionEntity: mockCurrentTrialSessionEntity,
      },
    );

    expect(updatedTrialSession).toMatchObject({
      ...mockCurrentTrialSessionEntity,
      swingSession: true,
      swingSessionId: MOCK_TRIAL_SESSION_FOR_ASSOCIATION.trialSessionId,
    });
  });
});
