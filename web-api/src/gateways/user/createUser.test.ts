import {
  DeliveryMediumType,
  MessageActionType,
} from '@aws-sdk/client-cognito-identity-provider';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { createUser } from '@web-api/gateways/user/createUser';

describe('createUser', () => {
  const mockUser = {
    email: 'petitioner@example.com',
    entityName: 'User',
    name: 'Bob Ross',
    role: ROLES.petitioner,
    section: 'petitioner',
    userId: '2f92447e-3a0b-4cfe-95cb-810aef270c03',
  };

  it('should make a call to persistence to create a user with the provided attributes', async () => {
    process.env.STAGE = 'prod';

    await createUser(applicationContext, {
      attributesToUpdate: {
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        userId: mockUser.userId,
      },
      email: mockUser.email,
      resendInvitationEmail: false,
    });

    expect(
      applicationContext.getCognito().adminCreateUser,
    ).toHaveBeenCalledWith({
      DesiredDeliveryMediums: [DeliveryMediumType.EMAIL],
      MessageAction: undefined,
      UserAttributes: [
        {
          Name: 'custom:role',
          Value: mockUser.role,
        },
        {
          Name: 'name',
          Value: mockUser.name,
        },
        {
          Name: 'custom:userId',
          Value: mockUser.userId,
        },
        {
          Name: 'email',
          Value: mockUser.email,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
      UserPoolId: applicationContext.environment.userPoolId,
      Username: mockUser.email,
    });
  });

  it('should resend an invitation email to the user when resendInvitationEmail is true', async () => {
    process.env.STAGE = 'prod';

    await createUser(applicationContext, {
      attributesToUpdate: {
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        userId: mockUser.userId,
      },
      email: mockUser.email,
      resendInvitationEmail: true,
    });

    expect(
      applicationContext.getCognito().adminCreateUser,
    ).toHaveBeenCalledWith({
      DesiredDeliveryMediums: [DeliveryMediumType.EMAIL],
      MessageAction: MessageActionType.RESEND,
      UserAttributes: [
        {
          Name: 'custom:role',
          Value: mockUser.role,
        },
        {
          Name: 'name',
          Value: mockUser.name,
        },
        {
          Name: 'custom:userId',
          Value: mockUser.userId,
        },
        {
          Name: 'email',
          Value: mockUser.email,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
      UserPoolId: applicationContext.environment.userPoolId,
      Username: mockUser.email,
    });
  });

  it('should NOT set the user`s temporary password when environment is prod', async () => {
    process.env.STAGE = 'prod';

    await createUser(applicationContext, {
      attributesToUpdate: {},
      email: mockUser.email,
      resendInvitationEmail: false,
    });

    expect(
      applicationContext.getCognito().adminCreateUser.mock.calls[0][0]
        .TemporaryPassword,
    ).toBe(undefined);
  });

  it('should set the user`s temporary password when the environment is NOT prod', async () => {
    process.env.STAGE = 'test';

    await createUser(applicationContext, {
      attributesToUpdate: {},
      email: mockUser.email,
      resendInvitationEmail: false,
    });

    expect(
      applicationContext.getCognito().adminCreateUser.mock.calls[0][0]
        .TemporaryPassword,
    ).toBe(process.env.DEFAULT_ACCOUNT_PASS);
  });
});
