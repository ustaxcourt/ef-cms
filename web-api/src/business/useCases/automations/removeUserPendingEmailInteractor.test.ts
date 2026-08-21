import { ROLES } from '@shared/business/entities/EntityConstants';
import '@web-api/persistence/postgres/users/mocks.jest';
import { removeUserPendingEmailInteractor } from '@web-api/business/useCases/automations/removeUserPendingEmailInteractor';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { upsertUsers as upsertUsersMock } from '@web-api/persistence/postgres/users/upsertUsers';
import { petitionsClerkUser } from '@shared/test/mockUsers';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

const getUserById = jest.mocked(getUserByIdMock);
const upsertUsers = jest.mocked(upsertUsersMock);

describe('removeUserPendingEmailInteractor', () => {
  const testUserId = '11111111-2222-3333-4444-555555555555';

  const authorizedUser = {
    role: ROLES.zendesk,
    userId: 'dabbad03-18d0-43ec-bafb-654e83405416',
    email: 'zendesk@example.com',
    name: 'Zendesk User',
  };

  const unauthorizedUser = {
    role: ROLES.docketClerk,
    userId: '9400d12e-302a-491d-8dce-6fd94f6f2ef5',
    email: 'unauth@example.com',
    name: 'Nope',
  };

  it('throws UnauthorizedError when user lacks permission', async () => {
    await expect(
      removeUserPendingEmailInteractor(
        { userId: testUserId },
        unauthorizedUser,
      ),
    ).rejects.toThrow('Unauthorized');

    expect(getUserById).not.toHaveBeenCalled();
    expect(upsertUsers).not.toHaveBeenCalled();
  });

  it('should throw a NotFoundError when the userId is not in the database', async () => {
    getUserById.mockResolvedValueOnce(undefined);

    await expect(
      removeUserPendingEmailInteractor({ userId: testUserId }, authorizedUser),
    ).rejects.toThrow(`Did not find ${testUserId} in database`);

    expect(getUserById).toHaveBeenCalledWith({ userId: testUserId });
    expect(upsertUsers).not.toHaveBeenCalled();
  });

  it("should return a message without upserting when the user's email is missing", async () => {
    getUserById.mockResolvedValueOnce({
      ...petitionsClerkUser,
      email: undefined,
    } as DbUser);

    const result = await removeUserPendingEmailInteractor(
      { userId: testUserId },
      authorizedUser,
    );

    expect(result).toBe(
      `User ${testUserId} has not yet activated their account; keeping 'pendingEmail' field`,
    );
    expect(upsertUsers).not.toHaveBeenCalled();
  });

  it('should clear pending fields and upsert when the user has an email', async () => {
    const dbUser = {
      userId: testUserId,
      email: 'active.user@example.com',
      pendingEmail: 'future@example.com',
      pendingEmailVerificationToken: 'abc-123',
      role: ROLES.petitionsClerk,
    };

    getUserById.mockResolvedValueOnce({ ...dbUser } as DbUser);

    const result = await removeUserPendingEmailInteractor(
      { userId: testUserId },
      authorizedUser as any,
    );

    expect(upsertUsers).toHaveBeenCalledTimes(1);
    const [[upsertArg]] = upsertUsers.mock.calls;
    expect(Array.isArray(upsertArg)).toBe(true);
    expect(upsertArg).toHaveLength(1);
    expect(upsertArg[0]).toEqual({
      ...dbUser,
      pendingEmail: undefined,
      pendingEmailVerificationToken: undefined,
    });

    expect(result).toBe(`Removed pending email for user ${testUserId}`);
  });

  it('should still upsert and succeed if pending fields are already undefined', async () => {
    const dbUser = {
      userId: testUserId,
      email: 'active.user@example.com',
      pendingEmail: undefined,
      pendingEmailVerificationToken: undefined,
      role: ROLES.docketClerk,
    };

    getUserById.mockResolvedValueOnce({ ...dbUser } as DbUser);

    const result = await removeUserPendingEmailInteractor(
      { userId: testUserId },
      authorizedUser as any,
    );

    expect(upsertUsers).toHaveBeenCalledWith([
      {
        ...dbUser,
        pendingEmail: undefined,
        pendingEmailVerificationToken: undefined,
      },
    ]);
    expect(result).toBe(`Removed pending email for user ${testUserId}`);
  });
});
