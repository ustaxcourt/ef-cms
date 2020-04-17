const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { getInternalUsersInteractor } = require('./getInternalUsersInteractor');
const { User } = require('../../entities/User');

describe('Get internal users', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.docketClerk,
      userId: 'docketclerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getInternalUsers.mockReturnValue([
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

  it('returns the same users that were returned from mocked persistence', async () => {
    const users = await getInternalUsersInteractor({ applicationContext });
    expect(users).toMatchObject([
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
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    });
    let error;
    try {
      await getInternalUsersInteractor({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
