const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  verifyUserPendingEmailInteractor,
} = require('./verifyUserPendingEmailInteractor');
const { ROLES } = require('../../entities/EntityConstants');
const { validUser } = require('../../../test/mockUsers');

describe('verifyUserPendingEmailInteractor', () => {
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
    applicationContext
      .getPersistenceGateway()
      .updateUserEmail.mockImplementation(() => mockUser);
  });

  it('should throw unauthorized error when user does not have permission to verify emails', async () => {
    mockUser = {
      role: ROLES.petitionsClerk,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    };

    await expect(
      verifyUserPendingEmailInteractor({
        applicationContext,
        token: 'abc',
      }),
    ).rejects.toThrow('Unauthorized to manage emails');
  });

  it('should throw an unauthorized is the token passed as an argument does not match stored token on user', async () => {
    mockUser = {
      pendingEmailVerificationToken: '123',
      role: ROLES.privatePractitioner,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    };
    await expect(
      verifyUserPendingEmailInteractor({
        applicationContext,
        token: 'abc',
      }),
    ).rejects.toThrow('Tokens do not match');
  });

  it('should throw an unauthorized is the token passed as an argument does not match stored token on user', async () => {
    mockUser = {
      pendingEmailVerificationToken: undefined,
      role: ROLES.privatePractitioner,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    };
    await expect(
      verifyUserPendingEmailInteractor({
        applicationContext,
        token: undefined,
      }),
    ).rejects.toThrow('Tokens do not match');
  });

  it('should update the cognito email if tokens match', async () => {
    mockUser = {
      ...validUser,
      email: 'test@example.com',
      pendingEmail: 'other@example.com',
      pendingEmailVerificationToken: 'a7d90c05-f6cd-442c-a168-202db587f16f',
      role: ROLES.privatePractitioner,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    };

    await verifyUserPendingEmailInteractor({
      applicationContext,
      token: 'a7d90c05-f6cd-442c-a168-202db587f16f',
    });

    expect(
      applicationContext.getPersistenceGateway().updateUserEmail,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().updateUserEmail.mock
        .calls[0][0].user,
    ).toMatchObject({
      email: 'test@example.com',
      pendingEmail: 'other@example.com',
      pendingEmailVerificationToken: 'a7d90c05-f6cd-442c-a168-202db587f16f',
    });
  });

  it('should update the the dynamo record with the new info', async () => {
    mockUser = {
      ...validUser,
      email: 'test@example.com',
      pendingEmail: 'other@example.com',
      pendingEmailVerificationToken: 'a7d90c05-f6cd-442c-a168-202db587f16f',
      role: ROLES.privatePractitioner,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    };

    await verifyUserPendingEmailInteractor({
      applicationContext,
      token: 'a7d90c05-f6cd-442c-a168-202db587f16f',
    });

    expect(
      applicationContext.getPersistenceGateway().updateUser,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
        .user,
    ).toMatchObject({
      email: 'other@example.com',
      pendingEmail: undefined,
      pendingEmailVerificationToken: undefined,
    });
  });
});
