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

  it('should create a practitioner user when the user role is privatePractitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'admin',
      userId: 'admin',
    });
    applicationContext.getPersistenceGateway().createUser.mockReturnValue({
      barNumber: 'CS20001',
      name: 'Test PrivatePractitioner',
      role: User.ROLES.privatePractitioner,
      userId: '745b7d39-8fae-4c2f-893c-3c829598bc71',
    });

    const userToCreate = {
      admissionsDate: new Date().toISOString(),
      admissionsStatus: 'Active',
      birthYear: '1993',
      employer: 'Private',
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

    expect(user).toMatchObject({
      barNumber: 'CS20001',
      role: User.ROLES.privatePractitioner,
    });
  });

  it('should create a practitioner user when the user role is irsPractitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'admin',
      userId: 'admin',
    });
    applicationContext.getPersistenceGateway().createUser.mockReturnValue({
      barNumber: 'CS20001',
      name: 'Test PrivatePractitioner',
      role: User.ROLES.irsPractitioner,
      userId: '745b7d39-8fae-4c2f-893c-3c829598bc71',
    });
    const mockAdmissionsDate = new Date('1876/02/19').toISOString();

    const user = await createUserInteractor({
      applicationContext,
      user: {
        admissionsDate: mockAdmissionsDate,
        admissionsStatus: 'Active',
        birthYear: '1993',
        employer: 'DOJ',
        firstName: 'Test',
        lastName: 'IRSPractitioner',
        originalBarState: 'CA',
        practitionerType: 'Attorney',
        role: User.ROLES.irsPractitioner,
      },
    });

    expect(user).toMatchObject({
      barNumber: 'CS20001',
      role: 'irsPractitioner',
    });
  });

  it('should create a practitioner user when the user role is inactivePractitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'admin',
      userId: 'admin',
    });
    applicationContext.getPersistenceGateway().createUser.mockReturnValue({
      barNumber: 'CS20001',
      name: 'Test InactivePractitioner',
      role: User.ROLES.inactivePractitioner,
      userId: '745b7d39-8fae-4c2f-893c-3c829598bc71',
    });
    const mockAdmissionsDate = new Date('1876/02/19').toISOString();

    const user = await createUserInteractor({
      applicationContext,
      user: {
        admissionsDate: mockAdmissionsDate,
        admissionsStatus: 'Inactive',
        birthYear: '1993',
        employer: 'DOJ',
        firstName: 'Test',
        lastName: 'IRSPractitioner',
        originalBarState: 'CA',
        practitionerType: 'Attorney',
        role: User.ROLES.inactivePractitioner,
      },
    });

    expect(user).toMatchObject({
      barNumber: 'CS20001',
      role: User.ROLES.inactivePractitioner,
    });
  });
});
