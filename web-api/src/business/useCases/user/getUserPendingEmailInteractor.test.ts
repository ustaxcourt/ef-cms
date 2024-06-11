import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getUserPendingEmailInteractor } from './getUserPendingEmailInteractor';

describe('getUserPendingEmailInteractor', () => {
  let currentLoggedInUser;
  const PENDING_EMAIL = 'pending@example.com';
  const USER_ID = 'a8024d79-1cd0-4864-bdd9-60325bd6d6b9';

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
      role: ROLES.petitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    await expect(
      getUserPendingEmailInteractor(applicationContext, {
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

    const result = await getUserPendingEmailInteractor(applicationContext, {
      userId: USER_ID,
    });

    expect(result).toEqual(PENDING_EMAIL);
  });

  it('should return undefined if user does not have a pending email', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      name: 'Test Petitioner',
      role: ROLES.petitioner,
      userId: USER_ID,
    });

    const result = await getUserPendingEmailInteractor(applicationContext, {
      userId: USER_ID,
    });

    expect(result).toBeUndefined();
  });

  it('should return undefined when the user is not found in persistence', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockResolvedValue(undefined);

    const result = await getUserPendingEmailInteractor(applicationContext, {
      userId: USER_ID,
    });

    expect(result).toBeUndefined();
  });
});
