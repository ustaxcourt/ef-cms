const { getTrialSessionsInteractor } = require('./getTrialSessionsInteractor');
const { omit } = require('lodash');

const MOCK_TRIAL_SESSION = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '3000-03-01T00:00:00.000Z',
  term: 'Fall',
  trialLocation: 'Birmingham, AL',
};

describe('Get trial sessions', () => {
  let applicationContext;

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
          getTrialSessions: () => {},
        };
      },
    };
    await expect(
      getTrialSessionsInteractor({
        applicationContext,
      }),
    ).rejects.toThrow();
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
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
          getTrialSessions: () =>
            Promise.resolve([omit(MOCK_TRIAL_SESSION, 'maxCases')]),
        };
      },
    };
    let error;
    try {
      await getTrialSessionsInteractor({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'The TrialSession entity was invalid ValidationError: child "maxCases" fails because ["maxCases" is required]',
    );
  });
});
