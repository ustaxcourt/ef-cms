import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getUsersPendingEmailInteractor } from './getUsersPendingEmailInteractor';
import {
  mockAdminUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('getUsersPendingEmailInteractor', () => {
  const PENDING_EMAIL = 'pending@example.com';
  const USER_IDS = [
    'a8024d79-1cd0-4864-bdd9-60325bd6d6b9',
    'f8024d79-1cd0-4864-bdd9-60325bd6d6b1',
  ];

  it('should throw an error when not authorized', async () => {
    await expect(
      getUsersPendingEmailInteractor(
        applicationContext,
        {
          userIds: USER_IDS,
        },
        mockAdminUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it("should return user's pending email", async () => {
    applicationContext.getPersistenceGateway().getUsersById.mockResolvedValue([
      {
        name: 'Roslindis Angelino',
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

    const result = await getUsersPendingEmailInteractor(
      applicationContext,
      {
        userIds: USER_IDS,
      },
      mockPetitionsClerkUser,
    );

    expect(result).toEqual({
      [USER_IDS[0]]: PENDING_EMAIL,
      [USER_IDS[1]]: PENDING_EMAIL,
    });
  });

  it('should return undefined for each user if user does not have a pending email', async () => {
    applicationContext.getPersistenceGateway().getUsersById.mockResolvedValue([
      {
        name: 'Roslindis Angelino',
        role: ROLES.petitioner,
        userId: USER_IDS[0],
      },
      {
        name: 'Lori Fieri',
        role: ROLES.petitioner,
        userId: USER_IDS[1],
      },
    ]);

    const result = await getUsersPendingEmailInteractor(
      applicationContext,
      {
        userIds: USER_IDS,
      },
      mockPetitionsClerkUser,
    );

    expect(result).toEqual({
      [USER_IDS[0]]: undefined,
      [USER_IDS[1]]: undefined,
    });
  });

  it('should return undefined for each user when the user is not found in persistence', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUsersById.mockResolvedValue([]);

    const result = await getUsersPendingEmailInteractor(
      applicationContext,
      {
        userIds: USER_IDS,
      },
      mockPetitionsClerkUser,
    );

    expect(result).toBeUndefined();
  });
});
