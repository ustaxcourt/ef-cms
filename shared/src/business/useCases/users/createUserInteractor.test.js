const {
  UnauthorizedError,
} = require('../../../../../shared/src/errors/errors');
const { createUser } = require('./createUserInteractor');

describe('create user', () => {
  it('creates the user', async () => {
    const mockUser = {
      name: 'Test PetitionsClerk',
      role: 'petitions',
      userId: 'petitionsclerk1@example.com',
    };
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'admin',
          userId: 'admin',
        };
      },
      getPersistenceGateway: () => {
        return {
          createUser: () => Promise.resolve(mockUser),
        };
      },
    };
    const userToCreate = { userId: 'petitionsclerk1@example.com' };
    const user = await createUser({
      applicationContext,
      userToCreate,
    });
    expect(user).not.toBeUndefined();
  });

  it('throws unauthorized for any user without an "admin" role', async () => {
    const mockUser = {
      name: 'Test Petitioner',
      role: 'petitioner',
      userId: 'petitioner1@example.com',
    };
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitioner',
          userId: 'admin',
        };
      },
      getPersistenceGateway: () => {
        return {
          createUser: () => Promise.resolve(mockUser),
        };
      },
    };
    const userToCreate = { userId: 'petitioner1@example.com' };
    let error;
    try {
      await createUser({
        applicationContext,
        userToCreate,
      });
    } catch (err) {
      error = err;
    }

    expect(error instanceof UnauthorizedError).toBeTruthy();
  });
});
