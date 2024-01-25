import { ROLES } from '@shared/business/entities/EntityConstants';
import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { signUpUserInteractor } from './signUpUserInteractor';

describe('signUpUserInteractor', () => {
  const email = 'example@example.com';
  const name = 'Antoninus Sara';
  const userId = 'c3f56e3d-0e6e-44bb-98f1-7c4a91dca1b9';
  const password = 'Pa$$w0rd!';
  const mockConfirmationCode = '09d0322d-12da-47c8-8d8b-cc76f97022c2';
  const user = { confirmPassword: password, email, name, password };

  beforeEach(() => {
    applicationContext.getUniqueId.mockReturnValue(userId);

    applicationContext.getCognito().signUp.mockResolvedValue({});

    applicationContext
      .getUseCaseHelpers()
      .createUserConfirmation.mockResolvedValue({
        confirmationCode: mockConfirmationCode,
      });
  });

  it('should create a new user account when the provided information is valid and the email does not already exist for an account in the system', async () => {
    const result = await signUpUserInteractor(applicationContext, {
      user,
    });

    expect(
      applicationContext.getCognito().signUp.mock.calls[0][0],
    ).toMatchObject({
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'name',
          Value: name,
        },
        {
          Name: 'custom:userId',
          Value: userId,
        },
        {
          Name: 'custom:role',
          Value: ROLES.petitioner,
        },
      ],
      Username: email,
    });
    expect(result).toEqual({
      confirmationCode: mockConfirmationCode,
      email: user.email,
      userId,
    });
  });

  it('should NOT return the confirmation code after successfully creating a user when the environment is NOT `local`', async () => {
    applicationContext.environment.stage = 'NOT_local';

    const result = await signUpUserInteractor(applicationContext, {
      user,
    });

    expect(result).toEqual({
      confirmationCode: undefined,
      email: user.email,
      userId,
    });
  });

  it('should throw an error when an error occurs while trying to create a new user account', async () => {
    applicationContext.getCognito().signUp.mockRejectedValue(new Error('abc'));

    await expect(
      signUpUserInteractor(applicationContext, {
        user,
      }),
    ).rejects.toThrow();

    expect(applicationContext.getCognito().signUp).toHaveBeenCalled();
  });

  it('should throw an error when the new user is not valid', async () => {
    await expect(
      signUpUserInteractor(applicationContext, {
        user: {
          confirmPassword: password,
          email,
          name,
          password: 'NOT_VALID_PASSWORD', // This password is not valid because it must contain a lowercase letter, symbol, and number
        },
      }),
    ).rejects.toThrow();

    expect(applicationContext.getCognito().signUp).not.toHaveBeenCalled();
  });

  it('should throw an error when the provided email already exists for an account in the system and it has been confirmed', async () => {
    applicationContext.getUserGateway().getUserByEmail.mockResolvedValue({
      accountStatus: UserStatusType.CONFIRMED,
      email,
      name,
      role: ROLES.petitioner,
      userId: '6f2ea0ba-f01b-4f8d-b3c1-8dee888b2da7',
    });

    await expect(
      signUpUserInteractor(applicationContext, {
        user,
      }),
    ).rejects.toThrow('User already exists');

    expect(applicationContext.getCognito().signUp).not.toHaveBeenCalled();
  });

  it('should throw an error when the provided email already exists for an account in the system and the account has not yet been confirmed', async () => {
    applicationContext.getUserGateway().getUserByEmail.mockResolvedValue({
      accountStatus: UserStatusType.UNCONFIRMED,
      email,
      name,
      role: ROLES.petitioner,
      userId: '6f2ea0ba-f01b-4f8d-b3c1-8dee888b2da7',
    });

    await expect(
      signUpUserInteractor(applicationContext, {
        user,
      }),
    ).rejects.toThrow('User exists, email unconfirmed');

    expect(applicationContext.getCognito().signUp).not.toHaveBeenCalled();
  });
});
