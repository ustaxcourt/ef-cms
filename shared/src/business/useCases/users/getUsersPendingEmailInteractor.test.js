const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getUsersPendingEmailInteractor,
} = require('./getUsersPendingEmailInteractor');
const { ROLES } = require('../../entities/EntityConstants');

describe('getUsersPendingEmailInteractor', () => {
  let currentLoggedInUser;
  const PENDING_EMAIL = 'pending@example.com';
  const USER_IDS = [
    'a8024d79-1cd0-4864-bdd9-60325bd6d6b9',
    'f8024d79-1cd0-4864-bdd9-60325bd6d6b1',
  ];

  beforeEach(() => {
    currentLoggedInUser = {
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.petitionsClerk,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    applicationContext.getCurrentUser.mockImplementation(
      () => currentLoggedInUser,
    );
  });

  it('should throw an error when not authorized', async () => {
    currentLoggedInUser = {
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.admin,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    await expect(
      getUsersPendingEmailInteractor(applicationContext, {
        userIds: USER_IDS,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it("should return user's pending email", async () => {
    applicationContext.getPersistenceGateway().getUsersById.mockResolvedValue([
      {
        name: 'Guy Fieri',
        pendingEmail: PENDING_EMAIL,
        role: ROLES.petitioner,
        userId: USER_IDS[0],
      },
      {
        name: 'Lori Fieri',
        pendingEmail: PENDING_EMAIL,
        role: ROLES.petitioner,
        userId: USER_IDS[1],
      },
    ]);

    const result = await getUsersPendingEmailInteractor(applicationContext, {
      userIds: USER_IDS,
    });

    expect(result).toEqual({
      [USER_IDS[0]]: PENDING_EMAIL,
      [USER_IDS[1]]: PENDING_EMAIL,
    });
  });

  it('should return undefined for each user if user does not have a pending email', async () => {
    applicationContext.getPersistenceGateway().getUsersById.mockResolvedValue([
      {
        name: 'Guy Fieri',
        role: ROLES.petitioner,
        userId: USER_IDS[0],
      },
      {
        name: 'Lori Fieri',
        role: ROLES.petitioner,
        userId: USER_IDS[1],
      },
    ]);

    const result = await getUsersPendingEmailInteractor(applicationContext, {
      userIds: USER_IDS,
    });

    expect(result).toEqual({
      [USER_IDS[0]]: undefined,
      [USER_IDS[1]]: undefined,
    });
  });

  it('should return undefined for each user when the user is not found in persistence', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUsersById.mockResolvedValue([]);

    const result = await getUsersPendingEmailInteractor(applicationContext, {
      userIds: USER_IDS,
    });

    expect(result).toBeUndefined();
  });
});
