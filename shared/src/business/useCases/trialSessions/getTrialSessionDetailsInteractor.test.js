const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getTrialSessionDetailsInteractor,
} = require('./getTrialSessionDetailsInteractor');
const { omit } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

const MOCK_TRIAL_SESSION = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '3000-03-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '3000',
  trialLocation: 'Birmingham, Alabama',
  trialSessionId: '208a959f-9526-4db5-b262-e58c476a4604',
};

let user;

describe('Get trial session details', () => {
  beforeEach(() => {
    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockImplementation(() => user);
  });

  it('throws error if user is unauthorized', async () => {
    user = {
      role: 'unauthorizedRole',
      userId: 'unauthorizedUser',
    };
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({});

    await expect(
      getTrialSessionDetailsInteractor({
        applicationContext,
        trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    user = {
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue(
        omit(MOCK_TRIAL_SESSION, 'maxCases'),
      );

    await expect(
      getTrialSessionDetailsInteractor({
        applicationContext,
        trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
      }),
    ).rejects.toThrow(
      'The TrialSession entity was invalid ValidationError: "maxCases" is required',
    );
  });

  it('throws a not found error if persistence does not return any results', async () => {
    user = {
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue(null);

    await expect(
      getTrialSessionDetailsInteractor({
        applicationContext,
        trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
      }),
    ).rejects.toThrow(
      'Trial session 208a959f-9526-4db5-b262-e58c476a4604 was not found.',
    );
  });

  it('correctly returns data from persistence', async () => {
    user = {
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue(MOCK_TRIAL_SESSION);

    const result = await getTrialSessionDetailsInteractor({
      applicationContext,
      trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
    });
    expect(result).toMatchObject(MOCK_TRIAL_SESSION);
  });
});
