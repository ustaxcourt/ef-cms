import '@web-api/persistence/postgres/users/mocks.jest';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { getUserPendingEmailInteractor } from './getUserPendingEmailInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';

const getUserById = getUserByIdMock as jest.Mock;

describe('getUserPendingEmailInteractor', () => {
  const PENDING_EMAIL = 'pending@example.com';
  const USER_ID = 'a8024d79-1cd0-4864-bdd9-60325bd6d6b9';

  it('should throw an error when not authorized', async () => {
    await expect(
      getUserPendingEmailInteractor(
        {
          userId: USER_ID,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it("should return user's pending email", async () => {
    getUserById.mockResolvedValue({
      name: 'Test Petitioner',
      pendingEmail: PENDING_EMAIL,
      role: ROLES.petitioner,
      userId: USER_ID,
    });

    const result = await getUserPendingEmailInteractor(
      {
        userId: USER_ID,
      },
      mockPetitionsClerkUser,
    );

    expect(result).toEqual(PENDING_EMAIL);
  });

  it('should return undefined if user does not have a pending email', async () => {
    getUserById.mockResolvedValue({
      name: 'Test Petitioner',
      role: ROLES.petitioner,
      userId: USER_ID,
    });

    const result = await getUserPendingEmailInteractor(
      {
        userId: USER_ID,
      },
      mockPetitionsClerkUser,
    );

    expect(result).toBeUndefined();
  });

  it('should return undefined when the user is not found in persistence', async () => {
    getUserById.mockResolvedValue(undefined);

    const result = await getUserPendingEmailInteractor(
      {
        userId: USER_ID,
      },
      mockPetitionsClerkUser,
    );

    expect(result).toBeUndefined();
  });
});
