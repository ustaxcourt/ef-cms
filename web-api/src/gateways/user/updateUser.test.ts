import { ROLES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { updateUser } from '@web-api/gateways/user/updateUser';

describe('updateUser', () => {
  it('should update the user`s email in persistence when it is provided as an attribute to update', async () => {
    const mockEmail = 'test@example.com';
    const mockUserPoolId = 'test';
    process.env.USER_POOL_ID = mockUserPoolId;

    await updateUser(applicationContext, {
      attributesToUpdate: {
        email: mockEmail,
      },
      email: mockEmail,
    });

    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).toHaveBeenCalledWith({
      UserAttributes: [
        {
          Name: 'email',
          Value: mockEmail,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
      UserPoolId: process.env.USER_POOL_ID,
      Username: mockEmail,
    });
  });

  it('should update the user`s role in persistence when it is provided as an attribute to update', async () => {
    const mockEmail = 'test@example.com';
    const mockUserPoolId = 'test';
    process.env.USER_POOL_ID = mockUserPoolId;

    await updateUser(applicationContext, {
      attributesToUpdate: {
        role: ROLES.petitioner,
      },
      email: mockEmail,
    });

    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).toHaveBeenCalledWith({
      UserAttributes: [
        {
          Name: 'custom:role',
          Value: ROLES.petitioner,
        },
      ],
      UserPoolId: process.env.USER_POOL_ID,
      Username: mockEmail,
    });
  });

  it('should update the user`s role and email in persistence when they are both provided as attributes to update', async () => {
    const mockEmail = 'test@example.com';
    const mockUserPoolId = 'test';
    process.env.USER_POOL_ID = mockUserPoolId;

    await updateUser(applicationContext, {
      attributesToUpdate: {
        email: mockEmail,
        role: ROLES.petitioner,
      },
      email: mockEmail,
    });

    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).toHaveBeenCalledWith({
      UserAttributes: [
        {
          Name: 'custom:role',
          Value: ROLES.petitioner,
        },
        {
          Name: 'email',
          Value: mockEmail,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
      UserPoolId: process.env.USER_POOL_ID,
      Username: mockEmail,
    });
  });
});
