import '@web-api/persistence/postgres/users/mocks.jest';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { getUserPendingEmailStatusInteractor } from './getUserPendingEmailStatusInteractor';
import {
  mockPetitionerUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { User } from '@shared/business/entities/User';
const getUserById = getUserByIdMock as jest.Mock;

describe('getUserPendingEmailStatusInteractor', () => {
  const PENDING_EMAIL = 'pending@example.com';
  const USER_ID = 'a8024d79-1cd0-4864-bdd9-60325bd6d6b9';

  it('should throw an error when not authorized', async () => {
    await expect(
      getUserPendingEmailStatusInteractor(
        {
          userId: USER_ID,
        },
        {
          ...mockPrivatePractitionerUser,
          role: ROLES.inactivePractitioner,
        },
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it("should return user's pending email", async () => {
    getUserById.mockResolvedValue(
      new User({
        name: 'Test Petitioner',
        pendingEmail: PENDING_EMAIL,
        role: ROLES.petitioner,
        userId: USER_ID,
      }),
    );

    const result = await getUserPendingEmailStatusInteractor(
      {
        userId: USER_ID,
      },
      mockPetitionerUser,
    );

    expect(result).toEqual(true);
  });

  it('should return undefined if user does not have a pending email', async () => {
    getUserById.mockResolvedValue(
      new User({
        name: 'Test Petitioner',
        role: ROLES.petitioner,
        userId: USER_ID,
      }),
    );

    const result = await getUserPendingEmailStatusInteractor(
      {
        userId: USER_ID,
      },
      mockPetitionerUser,
    );

    expect(result).toEqual(false);
  });

  it('should return undefined when the user is not found in persistence', async () => {
    getUserById.mockResolvedValue(undefined);

    const result = await getUserPendingEmailStatusInteractor(
      {
        userId: USER_ID,
      },
      mockPetitionerUser,
    );

    expect(result).toBeUndefined();
  });
});
