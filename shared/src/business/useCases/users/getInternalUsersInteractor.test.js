const { getInternalUsersInteractor } = require('./getInternalUsersInteractor');
const { User } = require('../../entities/User');

describe('Get internal users', () => {
  const applicationContext = {
    getCurrentUser: () => {
      return { role: User.ROLES.docketClerk, userId: 'docketclerk' };
    },
    getPersistenceGateway: () => ({
      getInternalUsers: () => [
        {
          userId: 'abc',
        },
        {
          userId: '123',
        },
        {
          userId: 'gg',
        },
      ],
    }),
  };

  it('returns the same users that were returned from mocked persistence', async () => {
    const users = await getInternalUsersInteractor({ applicationContext });
    expect(users).toEqual([
      {
        userId: 'abc',
      },
      {
        userId: '123',
      },
      {
        userId: 'gg',
      },
    ]);
  });

  it('throws unauthorized error for unauthorized users', async () => {
    let error;
    try {
      await getInternalUsersInteractor({
        applicationContext: {
          getCurrentUser: () => ({
            role: User.ROLES.petitioner,
            userId: 'petitioner',
          }),
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
