const { createUser } = require('./createUser.interactor');

describe('create user', () => {
  it('creates the user', async () => {
    const mockUser = {
      userId: 'petitionsclerk1@example.com',
      role: 'petitions',
      name: 'Test PetitionsClerk',
    };
    const applicationContext = {
      getPersistenceGateway: () => {
        return {
          createUser: () => Promise.resolve(mockUser),
        };
      },
      getCurrentUser: () => {
        return {
          userId: 'admin',
          role: 'admin',
        };
      },
      environment: { stage: 'local' },
    };
    const userToCreate = { userId: 'petitionsclerk1@example.com' };
    const user = await createUser({
      userToCreate,
      applicationContext,
    });
    expect(user).not.toBeUndefined();
  });

  it('throws unauthorized', async () => {
    const mockUser = {
      userId: 'petitioner1@example.com',
      role: 'petitioner',
      name: 'Test Petitioner',
    };
    const applicationContext = {
      getPersistenceGateway: () => {
        return {
          createUser: () => Promise.resolve(mockUser),
        };
      },
      getCurrentUser: () => {
        return {
          userId: 'admin',
          role: 'petitioner',
        };
      },
      environment: { stage: 'local' },
    };
    const userToCreate = { userId: 'petitioner1@example.com' };
    let error;
    try {
      await createUser({
        userToCreate,
        applicationContext,
      });
    } catch (err) {
      error = err;
    }

    expect(error).not.toBeUndefined();
  });
});
