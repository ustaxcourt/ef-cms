const sinon = require('sinon');
const {
  setTrialSessionAsSwingSessionInteractor,
} = require('./setTrialSessionAsSwingSessionInteractor');

const MOCK_TRIAL_SESSION = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '3000-03-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '3000',
  trialLocation: 'Birmingham, AL',
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
  const getTrialSessionByIdStub = sinon
    .stub()
    .returns(OTHER_MOCK_TRIAL_SESSION);
  const updateTrialSessionStub = sinon.stub().returns();

  it('throws error if user is unauthorized', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitioner',
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
          role: 'petitionsclerk',
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

    expect(getTrialSessionByIdStub.called).toEqual(true);
    expect(getTrialSessionByIdStub.getCall(0).args[0].trialSessionId).toEqual(
      '208a959f-9526-4db5-b262-e58c476a4604',
    );
    expect(updateTrialSessionStub.called).toEqual(true);
    expect(
      updateTrialSessionStub.getCall(0).args[0].trialSessionToUpdate,
    ).toMatchObject({
      ...OTHER_MOCK_TRIAL_SESSION,
      swingSession: true,
      swingSessionId: MOCK_TRIAL_SESSION.trialSessionId,
    });
  });
});
