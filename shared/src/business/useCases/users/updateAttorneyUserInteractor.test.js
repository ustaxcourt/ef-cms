const {
  UnauthorizedError,
} = require('../../../../../shared/src/errors/errors');
const {
  updateAttorneyUserInteractor,
} = require('./updateAttorneyUserInteractor');
const { User } = require('../../entities/User');

describe('update attorney user', () => {
  it('updates the attorney user', async () => {
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
          updateAttorneyUser: () => Promise.resolve(mockUser),
        };
      },
    };
    const userToCreate = { userId: 'practitioner1@example.com' };
    const user = await updateAttorneyUserInteractor({
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
      updateAttorneyUserInteractor({
        applicationContext,
        user: userToCreate,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });
});
