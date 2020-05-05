const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  UnauthorizedError,
} = require('../../../../../shared/src/errors/errors');

const { createUserInteractor } = require('./createUserInteractor');
const { User } = require('../../entities/User');

describe('create user', () => {
  let mockCurrentUser;

  beforeEach(() => {
    applicationContext.getCurrentUser.mockImplementation(() => mockCurrentUser);
  });

  it('creates the user', async () => {
    mockCurrentUser = {
      role: 'admin',
      userId: 'admin',
    };
    applicationContext.getPersistenceGateway().createUser.mockReturnValue({
      name: 'Test PetitionsClerk',
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk1@example.com',
    });
    const userToCreate = { userId: 'petitionsclerk1@example.com' };

    const user = await createUserInteractor({
      applicationContext,
      user: userToCreate,
    });

    expect(user).not.toBeUndefined();
  });

  it('throws unauthorized for any user without an "admin" role', async () => {
    mockCurrentUser = {
      role: User.ROLES.petitioner,
      userId: 'admin',
    };
    applicationContext.getPersistenceGateway().createUser.mockReturnValue({
      name: 'Test Petitioner',
      role: User.ROLES.petitioner,
      userId: 'petitioner1@example.com',
    });
    const userToCreate = { userId: 'petitioner1@example.com' };

    await expect(
      createUserInteractor({
        applicationContext,
        user: userToCreate,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });
});
