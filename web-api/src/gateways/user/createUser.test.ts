import { DeliveryMediumType } from '@aws-sdk/client-cognito-identity-provider';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { createUser } from '@web-api/gateways/user/createUser';

describe('createUser', () => {
  const userEmail = 'PetiTioneR@example.com';
  const lowerCasedEmail = 'petitioner@example.com';
  const mockUser = {
    email: userEmail,
    entityName: 'User',
    name: 'Bob Ross',
    role: ROLES.petitioner,
    section: 'petitioner',
    userId: '2f92447e-3a0b-4cfe-95cb-810aef270c03',
  };

  it('should make a call to persistence to create a user with the provided attributes, and the email lowercased', async () => {
    process.env.STAGE = 'prod';

    await createUser(applicationContext, {
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
      sendWelcomeEmail: true,
      userId: mockUser.userId,
    });

    expect(
      applicationContext.getCognito().adminCreateUser,
    ).toHaveBeenCalledWith({
      DesiredDeliveryMediums: [DeliveryMediumType.EMAIL],
      MessageAction: undefined,
      UserAttributes: [
        {
          Name: 'custom:userId',
          Value: mockUser.userId,
        },
        {
          Name: 'custom:role',
          Value: mockUser.role,
        },
        {
          Name: 'name',
          Value: mockUser.name,
        },
        {
          Name: 'email',
          Value: lowerCasedEmail,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
      UserPoolId: applicationContext.environment.userPoolId,
      Username: lowerCasedEmail,
    });
  });

  it('should NOT set the user`s temporary password when environment is prod', async () => {
    process.env.STAGE = 'prod';

    await createUser(applicationContext, {
      email: mockUser.email,
      name: 'terrance',
      role: 'docketclerk',
      sendWelcomeEmail: true,
      userId: 'b95429eb-54e1-4755-a35f-3b4f137f0693',
    });

    expect(
      applicationContext.getCognito().adminCreateUser.mock.calls[0][0]
        .TemporaryPassword,
    ).toBe(undefined);
  });

  it('should set the user`s temporary password when the environment is NOT prod', async () => {
    process.env.STAGE = 'test';
    applicationContext.environment.defaultAccountPass = 'hello';

    await createUser(applicationContext, {
      email: mockUser.email,
      name: 'matilda',
      role: 'adc',
      sendWelcomeEmail: true,
      userId: '2d09e076-1220-4abe-adb9-f73e9acb114d',
    });

    expect(
      applicationContext.getCognito().adminCreateUser.mock.calls[0][0]
        .TemporaryPassword,
    ).toBe('hello');
  });

  it('should set the user`s temporary password to the password requested when passed in', async () => {
    await createUser(applicationContext, {
      email: mockUser.email,
      name: 'matilda',
      role: 'adc',
      sendWelcomeEmail: true,
      temporaryPassword: 'personperson',
      userId: '2d09e076-1220-4abe-adb9-f73e9acb114d',
    });

    expect(
      applicationContext.getCognito().adminCreateUser.mock.calls[0][0]
        .TemporaryPassword,
    ).toBe('personperson');
  });
});
