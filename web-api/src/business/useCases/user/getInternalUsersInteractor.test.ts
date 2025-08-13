import '@web-api/persistence/postgres/users/mocks.jest';
import { getInternalUsers as getInternalUsersMock } from '@web-api/persistence/postgres/users/getInternalUsers';
import { getInternalUsersInteractor } from './getInternalUsersInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';
import { docketClerk1User, petitionsClerkUser } from '@shared/test/mockUsers';

describe('Get internal users', () => {
  const getInternalUsers = jest.mocked(getInternalUsersMock);
  beforeEach(() => {
    getInternalUsers.mockResolvedValue([
      docketClerk1User as DbUser,
      petitionsClerkUser as DbUser,
    ]);
  });

  it('returns the same users that were returned from mocked persistence', async () => {
    const users = await getInternalUsersInteractor(mockDocketClerkUser);
    expect(users).toMatchObject([
      docketClerk1User as DbUser,
      petitionsClerkUser as DbUser,
    ]);
  });

  it('throws unauthorized error for unauthorized users', async () => {
    let error;
    try {
      await getInternalUsersInteractor(mockPetitionerUser);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
