const { getInternalUsers } = require('./getInternalUsersInteractor');

describe('Get internal users', () => {
  const applicationContext = {
    getCurrentUser: () => {
      return { userId: 'docketclerk', role: 'docketclerk' };
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
    const users = await getInternalUsers({ applicationContext });
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
      await getInternalUsers({
        applicationContext: {
          getCurrentUser: () => ({
            userId: 'taxpayer',
            role: 'petitioner',
          }),
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
