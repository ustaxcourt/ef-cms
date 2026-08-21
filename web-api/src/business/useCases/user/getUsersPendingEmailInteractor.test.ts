jest.mock('@web-api/persistence/postgres/users/getUsersById');
import { getUsersByIds as getUsersByIdsMock } from '@web-api/persistence/postgres/users/getUsersById';
import {
  ACCOUNT_STATUS,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { getUsersPendingEmailInteractor } from './getUsersPendingEmailInteractor';
import {
  mockAdminUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

describe('getUsersPendingEmailInteractor', () => {
  const getUsersByIds = jest.mocked(getUsersByIdsMock);
  const PENDING_EMAIL = 'pending@example.com';
  const USER_IDS = [
    'a8024d79-1cd0-4864-bdd9-60325bd6d6b9',
    'f8024d79-1cd0-4864-bdd9-60325bd6d6b1',
  ];

  it('should throw an error when not authorized', async () => {
    await expect(
      getUsersPendingEmailInteractor(
        {
          userIds: USER_IDS,
        },
        mockAdminUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it("should return user's pending email", async () => {
    getUsersByIds.mockResolvedValue([
      {
        name: 'Roslindis Angelino',
        pendingEmail: PENDING_EMAIL,
        role: ROLES.petitioner,
        userId: USER_IDS[0],
        accountStatus: ACCOUNT_STATUS.active,
      } as DbUser,
      {
        name: 'Lori Fieri',
        pendingEmail: PENDING_EMAIL,
        role: ROLES.petitioner,
        userId: USER_IDS[1],
        accountStatus: ACCOUNT_STATUS.active,
      } as DbUser,
    ]);

    const result = await getUsersPendingEmailInteractor(
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

  it('should return an empty string for each user if user does not have a pending email', async () => {
    getUsersByIds.mockResolvedValue([
      {
        name: 'Roslindis Angelino',
        role: ROLES.petitioner,
        userId: USER_IDS[0],
        accountStatus: ACCOUNT_STATUS.active,
      } as DbUser,
      {
        name: 'Lori Fieri',
        role: ROLES.petitioner,
        userId: USER_IDS[1],
        accountStatus: ACCOUNT_STATUS.active,
      } as DbUser,
    ]);

    const result = await getUsersPendingEmailInteractor(
      {
        userIds: USER_IDS,
      },
      mockPetitionsClerkUser,
    );

    expect(result).toEqual({
      [USER_IDS[0]]: '',
      [USER_IDS[1]]: '',
    });
  });

  it('should return an empty object when the user is not found in persistence', async () => {
    getUsersByIds.mockResolvedValue([]);

    const result = await getUsersPendingEmailInteractor(
      {
        userIds: USER_IDS,
      },
      mockPetitionsClerkUser,
    );

    expect(result).toEqual({});
  });
});
