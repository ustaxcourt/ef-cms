import { TRIAL_SESSION_PROCEEDING_TYPES } from '../../entities/EntityConstants';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { applicationContext } from '../../test/createTestApplicationContext';
import { associateSwingTrialSessions } from './associateSwingTrialSessions';
const {
  petitionerUser,
  petitionsClerkUser,
} = require('../../../test/mockUsers');

const MOCK_TRIAL_SESSION = {
  maxCases: 100,
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
  sessionType: 'Regular',
  startDate: '3000-03-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '3000',
  trialLocation: 'Birmingham, Alabama',
  trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
};

const MOCK_TRIAL_SESSION_FOR_ASSOCIATION = {
  maxCases: 100,
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
  sessionType: 'Small',
  startDate: '3000-03-03T00:00:00.000Z',
  term: 'Fall',
  termYear: '3000',
  trialLocation: 'Birmingham, Alabama',
  trialSessionId: '208a959f-9526-4db5-b262-e58c476a4604',
};

let mockCurrentTrialSessionEntity;

describe('associateSwingTrialSessions', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

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

  it('retrieves the swing session to be associated from persistence', async () => {});

  it('updates the trial session to be associated with swing session information', async () => {});

  it('sets swing session information on the current trial session', async () => {});
});
