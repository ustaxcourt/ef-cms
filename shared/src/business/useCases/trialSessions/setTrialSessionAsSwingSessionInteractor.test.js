const {
  setTrialSessionAsSwingSessionInteractor,
} = require('./setTrialSessionAsSwingSessionInteractor');
const { User } = require('../../entities/User');

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

describe('Set trial session as swing session', () => {
  let applicationContext;
  const getTrialSessionByIdStub = jest
    .fn()
    .mockReturnValue(OTHER_MOCK_TRIAL_SESSION);
  const updateTrialSessionStub = jest.fn().mockReturnValue();

  it('throws error if user is unauthorized', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'petitioner',
        };
      },
      getPersistenceGateway: () => {
        return {
          getTrialSessionById: getTrialSessionByIdStub,
          updateTrialSession: updateTrialSessionStub,
        };
      },
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
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getTrialSessionById: getTrialSessionByIdStub,
          updateTrialSession: updateTrialSessionStub,
        };
      },
    };

    await setTrialSessionAsSwingSessionInteractor({
      applicationContext,
      swingSessionId: MOCK_TRIAL_SESSION.trialSessionId,
      trialSessionId: OTHER_MOCK_TRIAL_SESSION.trialSessionId,
    });

    expect(getTrialSessionByIdStub).toBeCalled();
    expect(getTrialSessionByIdStub.mock.calls[0][0].trialSessionId).toEqual(
      '208a959f-9526-4db5-b262-e58c476a4604',
    );
    expect(updateTrialSessionStub).toBeCalled();
    expect(
      updateTrialSessionStub.mock.calls[0][0].trialSessionToUpdate,
    ).toMatchObject({
      ...OTHER_MOCK_TRIAL_SESSION,
      swingSession: true,
      swingSessionId: MOCK_TRIAL_SESSION.trialSessionId,
    });
  });
});
