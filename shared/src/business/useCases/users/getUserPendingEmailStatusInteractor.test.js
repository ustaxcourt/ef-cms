const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getUserPendingEmailStatusInteractor,
} = require('./getUserPendingEmailStatusInteractor');
const { ROLES } = require('../../entities/EntityConstants');

describe('getUserPendingEmailStatusInteractor', () => {
  let currentLoggedInUser;
  const PENDING_EMAIL = 'pending@example.com';
  const USER_ID = 'a8024d79-1cd0-4864-bdd9-60325bd6d6b9';

  beforeEach(() => {
    currentLoggedInUser = {
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    applicationContext.getCurrentUser.mockImplementation(
      () => currentLoggedInUser,
    );
  });

  it('should throw an error when not authorized', async () => {
    currentLoggedInUser = {
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.inactivePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    await expect(
      getUserPendingEmailStatusInteractor(applicationContext, {
        userId: USER_ID,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it("should return user's pending email", async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      name: 'Test Petitioner',
      pendingEmail: PENDING_EMAIL,
      role: ROLES.petitioner,
      userId: USER_ID,
    });

    const result = await getUserPendingEmailStatusInteractor(
      applicationContext,
      {
        userId: USER_ID,
      },
    );

    expect(result).toEqual(true);
  });

  it('should return undefined if user does not have a pending email', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      name: 'Test Petitioner',
      role: ROLES.petitioner,
      userId: USER_ID,
    });

    const result = await getUserPendingEmailStatusInteractor(
      applicationContext,
      {
        userId: USER_ID,
      },
    );

    expect(result).toEqual(false);
  });

  it('should return undefined when the user is not found in persistence', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockResolvedValue(undefined);

    const result = await getUserPendingEmailStatusInteractor(
      applicationContext,
      {
        userId: USER_ID,
      },
    );

    expect(result).toBeUndefined();
  });
});
