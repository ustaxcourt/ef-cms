import { ROLES } from '@shared/business/entities/EntityConstants';
import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getUserByEmail } from '@web-api/gateways/user/getUserByEmail';

describe('getUserByEmail', () => {
  it('should return nothing when the user was not found in persistence', async () => {
    const mockEmail = 'does_not_exist@example.com';
    applicationContext
      .getCognito()
      .adminGetUser.mockRejectedValue({ name: 'UserNotFoundException' });

    const result = await getUserByEmail(applicationContext, {
      email: mockEmail,
    });

    expect(result).toBeUndefined();
  });

  it('should re-throw the original error when an error other than UserNotFound occurs when looking up the user by their email', async () => {
    const mockError = 'SomethingBadHappened';
    const mockEmail = 'exists@example.com';
    applicationContext
      .getCognito()
      .adminGetUser.mockRejectedValue(new Error(mockError));

    await expect(
      getUserByEmail(applicationContext, {
        email: mockEmail,
      }),
    ).rejects.toThrow(mockError);
  });

  it('should return the user when found by custom:userId', async () => {
    const mockEmail = 'exists@example.com';
    const mockAccountStatus = UserStatusType.CONFIRMED;
    const mockUserCustomId = 'b5f6bab7-0de1-4b85-8564-9430c22220d4';
    const mockUserName = 'Oran Muller';
    const mockUserRole = ROLES.petitioner;
    const mockUserRecord = {
      UserAttributes: [
        {
          Name: 'custom:role',
          Value: mockUserRole,
        },
        {
          Name: 'custom:userId',
          Value: mockUserCustomId,
        },
        {
          Name: 'email',
          Value: mockEmail,
        },
        {
          Name: 'name',
          Value: mockUserName,
        },
        {
          Name: 'sub',
          Value: 'SOMETHING_NOT_USER_ID',
        },
      ],
      UserStatus: mockAccountStatus,
    };
    applicationContext
      .getCognito()
      .adminGetUser.mockResolvedValue(mockUserRecord);

    const result = await getUserByEmail(applicationContext, {
      email: mockEmail,
    });

    expect(result).toEqual({
      accountStatus: mockAccountStatus,
      email: mockEmail,
      name: mockUserName,
      role: mockUserRole,
      userId: mockUserCustomId,
    });
  });
});
