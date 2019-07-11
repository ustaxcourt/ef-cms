const {
  getTrialSessionDetailsInteractor,
} = require('./getTrialSessionDetailsInteractor');
const { omit } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

const MOCK_TRIAL_SESSION = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '3000-03-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '3000',
  trialLocation: 'Birmingham, AL',
  trialSessionId: '208a959f-9526-4db5-b262-e58c476a4604',
};

describe('Get trial session details', () => {
  let applicationContext;

  it('throws error if user is unauthorized', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'unauthorizedRole',
          userId: 'unauthorizedUser',
        };
      },
      getPersistenceGateway: () => {
        return {
          getTrialSessionById: () => {},
        };
      },
    };
    await expect(
      getTrialSessionDetailsInteractor({
        applicationContext,
        trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
      }),
    ).rejects.toThrow(UnauthorizedError);
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
          getTrialSessionById: () =>
            Promise.resolve(omit(MOCK_TRIAL_SESSION, 'maxCases')),
        };
      },
    };
    let error;
    try {
      await getTrialSessionDetailsInteractor({
        applicationContext,
        trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'The TrialSession entity was invalid ValidationError: child "maxCases" fails because ["maxCases" is required]',
    );
  });

  it('throws a not found error if persistence does not return any results', async () => {
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
          getTrialSessionById: () => Promise.resolve(null),
        };
      },
    };
    let error;
    try {
      await getTrialSessionDetailsInteractor({
        applicationContext,
        trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'Trial session 208a959f-9526-4db5-b262-e58c476a4604 was not found.',
    );
  });

  it('correctly returns data from persistence', async () => {
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
          getTrialSessionById: () => Promise.resolve(MOCK_TRIAL_SESSION),
        };
      },
    };
    const result = await getTrialSessionDetailsInteractor({
      applicationContext,
      trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
    });
    expect(result).toMatchObject(MOCK_TRIAL_SESSION);
  });
});
