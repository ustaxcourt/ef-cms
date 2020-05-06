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

    const userToCreate = {
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk1@example.com',
    };
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

    await expect(
      createUserInteractor({
        applicationContext,
        user: userToCreate,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('adds a barNumber and userId if the user is a practitioner', async () => {
    const mockUser = {
      barNumber: 'CS20001',
      name: 'Test PrivatePractitioner',
      role: User.ROLES.privatePractitioner,
      userId: '745b7d39-8fae-4c2f-893c-3c829598bc71',
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'admin',
      userId: 'admin',
    });
    applicationContext
      .getPersistenceGateway()
      .createUser.mockReturnValue(mockUser);

    const userToCreate = {
      admissionsDate: new Date(),
      admissionsStatus: 'Active',
      birthYear: '1993',
      employer: 'DOJ',
      firstName: 'Test',
      lastName: 'PrivatePractitioner',
      originalBarState: 'CA',
      practitionerType: 'Attorney',
      role: User.ROLES.privatePractitioner,
    };

    const user = await createUserInteractor({
      applicationContext,
      user: userToCreate,
    });
    expect(user).not.toBeUndefined();
    expect(user.barNumber).toBe('CS20001');
    expect(user.userId).toBe('745b7d39-8fae-4c2f-893c-3c829598bc71');
  });
});
