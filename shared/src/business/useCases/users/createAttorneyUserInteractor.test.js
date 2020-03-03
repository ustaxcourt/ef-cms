const {
  createAttorneyUserInteractor,
} = require('./createAttorneyUserInteractor');
const {
  UnauthorizedError,
} = require('../../../../../shared/src/errors/errors');
const { User } = require('../../entities/User');

describe('create attorney user', () => {
  it('creates the attorney user', async () => {
    const mockUser = {
      name: 'Test Attorney',
      role: User.ROLES.practitioner,
      userId: 'practitioner1@example.com',
    };
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitionsclerk',
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          createAttorneyUser: () => Promise.resolve(mockUser),
        };
      },
    };
    const userToCreate = { userId: 'practitioner1@example.com' };
    const user = await createAttorneyUserInteractor({
      applicationContext,
      user: userToCreate,
    });
    expect(user).not.toBeUndefined();
  });

  it('throws unauthorized for a non-internal user', async () => {
    const mockUser = {
      name: 'Test Attorney',
      role: User.ROLES.practitioner,
      userId: 'practitioner1@example.com',
    };
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'admin',
        };
      },
      getPersistenceGateway: () => {
        return {
          createUser: () => Promise.resolve(mockUser),
        };
      },
    };
    const userToCreate = { userId: 'practitioner1@example.com' };
    await expect(
      createAttorneyUserInteractor({
        applicationContext,
        user: userToCreate,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });
});
