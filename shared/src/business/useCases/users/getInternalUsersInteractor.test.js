const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { getInternalUsersInteractor } = require('./getInternalUsersInteractor');
const { ROLES } = require('../../entities/EntityConstants');

describe('Get internal users', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketclerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getInternalUsers.mockReturnValue([
        {
          userId: '343db562-5187-49e3-97fe-90f5fa70b9d4',
        },
        {
          userId: 'a34fd25c-a2d0-4f89-b495-c52805c9fdd0',
        },
        {
          userId: 'bed3b49a-283c-491b-a1c5-0ece5832c6f4',
        },
      ]);
  });

  it('returns the same users that were returned from mocked persistence', async () => {
    const users = await getInternalUsersInteractor({ applicationContext });
    expect(users).toMatchObject([
      {
        userId: '343db562-5187-49e3-97fe-90f5fa70b9d4',
      },
      {
        userId: 'a34fd25c-a2d0-4f89-b495-c52805c9fdd0',
      },
      {
        userId: 'bed3b49a-283c-491b-a1c5-0ece5832c6f4',
      },
    ]);
  });

  it('throws unauthorized error for unauthorized users', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
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
