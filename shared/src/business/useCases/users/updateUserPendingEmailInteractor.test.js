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
    mockUser = { ...validUser, role: ROLES.privatePractitioner };

    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => mockUser);
    applicationContext
      .getPersistenceGateway()
      .updateUser.mockImplementation(() => mockUser);
  });

  it('should throw unauthorized error when user does not have permission to manage emails', async () => {
    mockUser = {
      role: ROLES.petitionsClerk,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    };

    await expect(
      updateUserPendingEmailInteractor({
        applicationContext,
        pendingEmail,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should make a call to get the current user', async () => {
    await updateUserPendingEmailInteractor({
      applicationContext,
      pendingEmail,
    });

    expect(applicationContext.getCurrentUser).toHaveBeenCalled();
  });

  it('should make a call to getUserById with the logged in user.userId', async () => {
    await updateUserPendingEmailInteractor({
      applicationContext,
      pendingEmail,
    });

    expect(
      applicationContext.getPersistenceGateway().getUserById.mock.calls[0][0],
    ).toMatchObject({ userId: mockUser.userId });
  });

  it('should update the user record in persistence with the pendingEmail value', async () => {
    await updateUserPendingEmailInteractor({
      applicationContext,
      pendingEmail,
    });

    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
        .user,
    ).toMatchObject({ pendingEmail });
  });

  it('should return the updated user entity', async () => {
    const results = await updateUserPendingEmailInteractor({
      applicationContext,
      pendingEmail,
    });

    expect(results).toMatchObject({
      ...mockUser,
      pendingEmail,
      pendingEmailVerificationToken: expect.anything(),
    });
  });

  it('should attempt to send out a verification link email', async () => {
    const results = await updateUserPendingEmailInteractor({
      applicationContext,
      pendingEmail,
    });

    const {
      email,
      templateData,
    } = applicationContext.getDispatchers().sendBulkTemplatedEmail.mock.calls[0][0].destinations[0];

    expect(email).toEqual(pendingEmail);
    expect(templateData.emailContent).toContain(
      results.pendingEmailVerificationToken,
    );
  });
});
