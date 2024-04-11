import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createOrUpdatePractitionerUser } from './createOrUpdatePractitionerUser';

describe('createOrUpdatePractitionerUser', () => {
  const oldEnv = process.env;

  afterAll(() => {
    process.env = oldEnv;
  });

  const userId = '9b52c605-edba-41d7-b045-d5f992a499d3';
  const privatePractitionerUser = {
    barNumber: 'pt1234',
    email: 'test@example.com',
    entityName: 'PrivatePractitioner',
    name: 'Test Private Practitioner',
    role: ROLES.privatePractitioner,
    section: 'privatePractitioner',
    userId,
  };
  const privatePractitionerUserWithSection = {
    barNumber: 'pt1234',
    email: 'test@example.com',
    entityName: 'PrivatePractitioner',
    name: 'Test Private Practitioner',
    role: ROLES.privatePractitioner,
    section: 'privatePractitioner',
  };
  const otherUser = {
    barNumber: 'pt1234',
    email: 'test@example.com',
    name: 'Test Other',
    role: 'other',
    section: 'other',
  };

  const setupNonExistingUserMock = () => {
    applicationContext
      .getUserGateway()
      .getUserByEmail.mockResolvedValue(undefined);
  };

  it('should throw an error when attempting to create a user that is NOT private practitioner, IRS practitioner or inactive practitioner', async () => {
    await expect(
      createOrUpdatePractitionerUser({
        applicationContext,
        user: otherUser as any,
      }),
    ).rejects.toThrow(
      `Role must be ${ROLES.privatePractitioner}, ${ROLES.irsPractitioner}, or ${ROLES.inactivePractitioner}`,
    );
  });

  it('should persist practitioner user records and NOT create a cognito account when the practitioner does not have an email address', async () => {
    setupNonExistingUserMock();

    await createOrUpdatePractitionerUser({
      applicationContext,
      user: {
        ...privatePractitionerUser,
        email: undefined,
        pendingEmail: undefined,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().createUserRecords,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUserGateway().createUser,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUserGateway().updateUser,
    ).not.toHaveBeenCalled();
  });

  it('should persist practitioner user records and create a cognito account for a practitioner user with email address', async () => {
    setupNonExistingUserMock();

    await createOrUpdatePractitionerUser({
      applicationContext,
      user: privatePractitionerUserWithSection,
    });

    expect(
      applicationContext.getUserGateway().createUser.mock.calls[0][1]
        .attributesToUpdate.email,
    ).toBe(privatePractitionerUserWithSection.email);
    expect(applicationContext.getUserGateway().createUser).toHaveBeenCalled();
    expect(
      applicationContext.getUserGateway().updateUser,
    ).not.toHaveBeenCalled();
  });

  it('should persist practitioner user records and create a cognito account for a practitioner user with a pending email address', async () => {
    const mockPendingEmail = 'noone@example.com';
    setupNonExistingUserMock();

    await createOrUpdatePractitionerUser({
      applicationContext,
      user: {
        ...privatePractitionerUserWithSection,
        email: undefined,
        pendingEmail: mockPendingEmail,
      },
    });

    expect(
      applicationContext.getUserGateway().createUser.mock.calls[0][1]
        .attributesToUpdate.email,
    ).toBe(mockPendingEmail);
  });

  it('should update an account for a practitioner user with email address that already had an account', async () => {
    applicationContext.getUserGateway().getUserByEmail.mockResolvedValue({
      accountStatus: UserStatusType.CONFIRMED,
      email: privatePractitionerUser.email,
      name: privatePractitionerUser.name,
      role: privatePractitionerUser.role,
      userId: privatePractitionerUser.userId,
    });

    await createOrUpdatePractitionerUser({
      applicationContext,
      user: privatePractitionerUser,
    });

    expect(applicationContext.getUserGateway().updateUser).toHaveBeenCalled();
  });
});
