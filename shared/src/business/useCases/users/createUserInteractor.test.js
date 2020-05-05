const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  UnauthorizedError,
} = require('../../../../../shared/src/errors/errors');

const { createUserInteractor } = require('./createUserInteractor');
const { User } = require('../../entities/User');

describe('create user', () => {
  it('creates the user', async () => {
    const mockUser = {
      name: 'Test PetitionsClerk',
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk1@example.com',
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'admin',
      userId: 'admin',
    });
    applicationContext
      .getPersistenceGateway()
      .createUser.mockReturnValue(mockUser);
    const userToCreate = { userId: 'petitionsclerk1@example.com' };

    const user = await createUserInteractor({
      applicationContext,
      user: userToCreate,
    });

    expect(user).not.toBeUndefined();
  });

  it('throws unauthorized for any user without an "admin" role', async () => {
    const mockUser = {
      name: 'Test Petitioner',
      role: User.ROLES.petitioner,
      userId: 'petitioner1@example.com',
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitioner,
      userId: 'admin',
    });
    applicationContext
      .getPersistenceGateway()
      .createUser.mockReturnValue(mockUser);
    const userToCreate = { userId: 'petitioner1@example.com' };
    let error;
    try {
      await createUserInteractor({
        applicationContext,
        user: userToCreate,
      });
    } catch (err) {
      error = err;
    }

    expect(error instanceof UnauthorizedError).toBeTruthy();
  });
});
