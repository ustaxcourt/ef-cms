const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateUserPendingEmailInteractor,
} = require('./updateUserPendingEmailInteractor');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');
const { validUser } = require('../../../test/mockUsers');

describe('updateUserPendingEmailInteractor', () => {
  const pendingEmail = 'hello@example.com';
  let mockUser;

  beforeEach(() => {
    mockUser = {
      ...validUser,
      admissionsDate: '2019-03-01',
      admissionsStatus: 'Active',
      barNumber: 'RA3333',
      birthYear: '1950',
      employer: 'Private',
      firstName: 'Alden',
      lastName: 'Rivas',
      name: 'Alden Rivas',
      originalBarState: 'FL',
      practitionerType: 'Attorney',
      role: ROLES.privatePractitioner,
    };

    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => mockUser);
    applicationContext
      .getPersistenceGateway()
      .updateUser.mockImplementation(() => mockUser);
    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockReturnValue(true);
  });

  it('should throw unauthorized error when user does not have permission to manage emails', async () => {
    mockUser = {
      role: ROLES.petitionsClerk,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    };

    await expect(
      updateUserPendingEmailInteractor(applicationContext, {
        pendingEmail,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw an error when the pendingEmail address is not available in cognito', async () => {
    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockReturnValue(false);

    await expect(
      updateUserPendingEmailInteractor(applicationContext, {
        pendingEmail,
      }),
    ).rejects.toThrow('Email is not available');
  });

  it('should make a call to get the current user', async () => {
    await updateUserPendingEmailInteractor(applicationContext, {
      pendingEmail,
    });

    expect(applicationContext.getCurrentUser).toHaveBeenCalled();
  });

  it('should make a call to getUserById with the logged in user.userId', async () => {
    await updateUserPendingEmailInteractor(applicationContext, {
      pendingEmail,
    });

    expect(
      applicationContext.getPersistenceGateway().getUserById.mock.calls[0][0],
    ).toMatchObject({ userId: mockUser.userId });
  });

  it('should update the user record in persistence with the pendingEmail value', async () => {
    await updateUserPendingEmailInteractor(applicationContext, {
      pendingEmail,
    });

    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
        .user,
    ).toMatchObject({ pendingEmail });
  });

  it('should return the updated User entity when currentUser.role is petitioner', async () => {
    mockUser = validUser;

    const results = await updateUserPendingEmailInteractor(applicationContext, {
      pendingEmail,
    });

    expect(results.entityName).toBe('User');
    expect(results).toMatchObject({
      ...mockUser,
      pendingEmail,
      pendingEmailVerificationToken: expect.anything(),
    });
  });

  it('should return the updated Practitioner entity when currentUser.role is NOT petitioner', async () => {
    const results = await updateUserPendingEmailInteractor(applicationContext, {
      pendingEmail,
    });

    expect(results.entityName).toBe('Practitioner');
    expect(results).toMatchObject({
      ...mockUser,
      pendingEmail,
      pendingEmailVerificationToken: expect.anything(),
    });
  });

  it('should call applicationContext.getUseCaseHelpers().sendEmailVerificationLink to send the verification link to the user', async () => {
    await updateUserPendingEmailInteractor(applicationContext, {
      pendingEmail,
    });

    expect(
      applicationContext.getUseCaseHelpers().sendEmailVerificationLink.mock
        .calls[0][0],
    ).toMatchObject({
      pendingEmail,
      pendingEmailVerificationToken: expect.anything(),
    });
  });
});
