import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getInternalUsersInteractor } from './getInternalUsersInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('Get internal users', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getInternalUsers.mockReturnValue([
        {
          name: 'Saul Goodman',
          userId: '343db562-5187-49e3-97fe-90f5fa70b9d4',
        },
        {
          name: 'Saul Goodman',
          userId: 'a34fd25c-a2d0-4f89-b495-c52805c9fdd0',
        },
        {
          name: 'Saul Goodman',
          userId: 'bed3b49a-283c-491b-a1c5-0ece5832c6f4',
        },
      ]);
  });

  it('returns the same users that were returned from mocked persistence', async () => {
    const users = await getInternalUsersInteractor(
      applicationContext,
      mockDocketClerkUser,
    );
    expect(users).toMatchObject([
      {
        name: 'Saul Goodman',
        userId: '343db562-5187-49e3-97fe-90f5fa70b9d4',
      },
      {
        name: 'Saul Goodman',
        userId: 'a34fd25c-a2d0-4f89-b495-c52805c9fdd0',
      },
      {
        name: 'Saul Goodman',
        userId: 'bed3b49a-283c-491b-a1c5-0ece5832c6f4',
      },
    ]);
  });

  it('throws unauthorized error for unauthorized users', async () => {
    let error;
    try {
      await getInternalUsersInteractor(applicationContext, mockPetitionerUser);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
