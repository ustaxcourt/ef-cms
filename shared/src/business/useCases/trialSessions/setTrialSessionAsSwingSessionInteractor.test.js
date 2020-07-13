const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  setTrialSessionAsSwingSessionInteractor,
} = require('./setTrialSessionAsSwingSessionInteractor');
const { ROLES } = require('../../entities/EntityConstants');

const MOCK_TRIAL_SESSION = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '3000-03-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '3000',
  trialLocation: 'Birmingham, Alabama',
  trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
};

const OTHER_MOCK_TRIAL_SESSION = {
  maxCases: 100,
  sessionType: 'Small',
  startDate: '3000-03-03T00:00:00.000Z',
  term: 'Fall',
  termYear: '3000',
  trialLocation: 'Huntsville, AL',
  trialSessionId: '208a959f-9526-4db5-b262-e58c476a4604',
};

let user;

describe('Set trial session as swing session', () => {
  beforeEach(() => {
    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockImplementation(() => user);
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(OTHER_MOCK_TRIAL_SESSION);
    applicationContext
      .getPersistenceGateway()
      .updateTrialSession.mockReturnValue();
  });

  it('throws error if user is unauthorized', async () => {
    user = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      setTrialSessionAsSwingSessionInteractor({
        applicationContext,
        swingSessionId: MOCK_TRIAL_SESSION.trialSessionId,
        trialSessionId: OTHER_MOCK_TRIAL_SESSION.trialSessionId,
      }),
    ).rejects.toThrow();
  });

  it('calls getTrialSessionById and updateTrialSession persistence methods with correct parameters', async () => {
    user = {
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };

    await setTrialSessionAsSwingSessionInteractor({
      applicationContext,
      swingSessionId: MOCK_TRIAL_SESSION.trialSessionId,
      trialSessionId: OTHER_MOCK_TRIAL_SESSION.trialSessionId,
    });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById.mock
        .calls[0][0].trialSessionId,
    ).toEqual('208a959f-9526-4db5-b262-e58c476a4604');
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate,
    ).toMatchObject({
      ...OTHER_MOCK_TRIAL_SESSION,
      swingSession: true,
      swingSessionId: MOCK_TRIAL_SESSION.trialSessionId,
    });
  });
});
