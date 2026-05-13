jest.mock('@web-api/persistence/postgres/utils/transactions');
jest.mock('@web-api/persistence/postgres/users/upsertUsers');
jest.mock('@web-api/persistence/postgres/users/upsertUsers');

import { petitionerUser } from '@shared/test/mockUsers';
import { createNewPetitionerUser } from '@web-api/persistence/postgres/users/createNewPetitionerUser';
import { getUserGateway as getUserGatewayMock } from '@web-api/getUserGateway';
import { upsertUsers as upsertUsersMock } from '@web-api/persistence/postgres/users/upsertUsers';
import {
  inTransaction as inTransactionMock,
  onTransactionCommit as onTransactionCommitMock,
} from '@web-api/persistence/postgres/utils/transactions';
import { ROLES } from '@shared/business/entities/EntityConstants';
jest.mock('@web-api/getUserGateway', () => ({
  getUserGateway: jest.fn(() => ({
    createUser: jest.fn(),
  })),
}));

describe('createNewPetitionerUser', () => {
  const inTransaction = jest.mocked(inTransactionMock);
  const onTransactionCommit = jest.mocked(onTransactionCommitMock);
  const upsertUsers = jest.mocked(upsertUsersMock);
  const getUserGateway = getUserGatewayMock as jest.Mock;

  beforeAll(() => {
    getUserGateway.mockReturnValue({
      createUser: jest.fn().mockResolvedValue(undefined),
    });
  });

  it('should call createUser and upsertUser when creating a user outside of a transaction', async () => {
    inTransaction.mockReturnValueOnce(false);

    await createNewPetitionerUser({ user: petitionerUser });

    expect(upsertUsers).toHaveBeenCalledWith([petitionerUser]);
    expect(getUserGateway().createUser.mock.calls[0][1]).toEqual({
      email: petitionerUser.pendingEmail!,
      name: petitionerUser.name,
      role: ROLES.petitioner,
      sendWelcomeEmail: true,
      userId: petitionerUser.userId,
    });
    expect(onTransactionCommit).not.toHaveBeenCalled();
  });

  it('should add call to createUser to onTransactionCommit callbacks if in a transaction', async () => {
    inTransaction.mockReturnValueOnce(true);

    await createNewPetitionerUser({ user: petitionerUser });

    expect(upsertUsers).toHaveBeenCalledWith([petitionerUser]);
    expect(getUserGateway().createUser).not.toHaveBeenCalled();
    expect(onTransactionCommit).toHaveBeenCalled();
  });
});
