const { getTrialSessionsInteractor } = require('./getTrialSessionsInteractor');
const { omit } = require('lodash');
const { User } = require('../../entities/User');

const MOCK_TRIAL_SESSION = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '3000-03-01T00:00:00.000Z',
  term: 'Fall',
  trialLocation: 'Birmingham, Alabama',
};

describe('Get trial sessions', () => {
  let applicationContext;

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
          getTrialSessions: () => {},
        };
      },
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getTrialSessions: () =>
            Promise.resolve([omit(MOCK_TRIAL_SESSION, 'maxCases')]),
        };
      },
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
      'The TrialSession entity was invalid ValidationError: "maxCases" is required',
    );
  });
});
