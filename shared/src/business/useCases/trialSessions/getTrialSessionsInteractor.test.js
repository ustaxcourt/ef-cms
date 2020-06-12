const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { getTrialSessionsInteractor } = require('./getTrialSessionsInteractor');
const { omit } = require('lodash');
const { ROLES } = require('../../entities/EntityConstants');

const MOCK_TRIAL_SESSION = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '3000-03-01T00:00:00.000Z',
  term: 'Fall',
  trialLocation: 'Birmingham, Alabama',
};

describe('Get trial sessions', () => {
  it('throws error if user is unauthorized', async () => {
    applicationContext.getUniqueId.mockReturnValue(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );

    await expect(
      getTrialSessionsInteractor({
        applicationContext,
      }),
    ).rejects.toThrow();
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext.getCurrentUser.mockImplementation(() => {
      return {
        role: ROLES.petitionsClerk,
        userId: 'petitionsclerk',
      };
    });
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockImplementation(() =>
        Promise.resolve([omit(MOCK_TRIAL_SESSION, 'maxCases')]),
      );
    let error;

    try {
      await getTrialSessionsInteractor({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain('The TrialSession entity was invalid');
  });
});
