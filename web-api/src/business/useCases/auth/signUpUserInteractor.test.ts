import { ROLES } from '@shared/business/entities/EntityConstants';
import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { signUpUserInteractor } from './signUpUserInteractor';

describe('signUpUserInteractor', () => {
  const email = 'example@example.com';
  const name = 'Antoninus Sara';
  const mockUserId = 'c3f56e3d-0e6e-44bb-98f1-7c4a91dca1b9';
  const password = 'Pa$$w0rd!';
  const mockConfirmationCode = '09d0322d-12da-47c8-8d8b-cc76f97022c2';
  const user = { confirmPassword: password, email, name, password };

  beforeEach(() => {
    applicationContext
      .getUserGateway()
      .signUp.mockResolvedValue({ userId: mockUserId });

    applicationContext
      .getUseCaseHelpers()
      .createUserConfirmation.mockResolvedValue({
        confirmationCode: mockConfirmationCode,
      });
  });

  it('should create a new user account when the provided information is valid and the email does not already exist for an account in the system', async () => {
    applicationContext
      .getCognito()
      .listUsers.mockResolvedValue({ Users: undefined });

    const result = await signUpUserInteractor(applicationContext, {
      user,
    });

    expect(applicationContext.getUserGateway().signUp).toHaveBeenCalledWith(
      applicationContext,
      {
        email,
        name,
        password,
        role: ROLES.petitioner,
      },
    );
    expect(result).toEqual({
      confirmationCode: mockConfirmationCode,
      email: user.email,
      userId: mockUserId,
    });
  });

  it('should NOT return the confirmation code after successfully creating a user when the environment is NOT `local`', async () => {
    applicationContext
      .getCognito()
      .listUsers.mockResolvedValue({ Users: undefined });
    applicationContext.environment.stage = 'NOT_local';

    const result = await signUpUserInteractor(applicationContext, {
      user,
    });

    expect(result).toEqual({
      confirmationCode: undefined,
      email: user.email,
      userId: mockUserId,
    });
  });

  it('should throw an error when an error occurs while trying to create a new user account', async () => {
    applicationContext
      .getCognito()
      .listUsers.mockResolvedValue({ Users: undefined });
    applicationContext
      .getUserGateway()
      .signUp.mockRejectedValue(new Error('abc'));

    await expect(
      signUpUserInteractor(applicationContext, {
        user,
      }),
    ).rejects.toThrow();

    expect(applicationContext.getUserGateway().signUp).toHaveBeenCalled();
  });

  it('should throw an error when the new user is not valid', async () => {
    applicationContext
      .getCognito()
      .listUsers.mockResolvedValue({ Users: undefined });

    await expect(
      signUpUserInteractor(applicationContext, {
        user: {
          confirmPassword: password,
          email,
          name,
          password: 'NOT_VALID_PASSWORD', // This password is not valid because it must contain a lowercase letter, symbol, and number
        },
      }),
    ).rejects.toThrow(
      'The NewPetitionerUser entity was invalid. {"password":"Must contain number","confirmPassword":"Passwords must match"}',
    );
  });

  it('should throw an error when the provided email already exists for an account in the system and it has been confirmed', async () => {
    applicationContext.getUserGateway().getUserByEmail.mockResolvedValue({
      accountStatus: UserStatusType.CONFIRMED,
    });

    await expect(
      signUpUserInteractor(applicationContext, {
        user,
      }),
    ).rejects.toThrow('User already exists');

    expect(applicationContext.getUserGateway().signUp).not.toHaveBeenCalled();
  });

  it('should throw an error when the provided email already exists for an account in the system and the account has not yet been confirmed', async () => {
    applicationContext.getUserGateway().getUserByEmail.mockResolvedValue({
      accountStatus: UserStatusType.UNCONFIRMED,
    });

    await expect(
      signUpUserInteractor(applicationContext, {
        user,
      }),
    ).rejects.toThrow('User exists, email unconfirmed');

    expect(applicationContext.getUserGateway().signUp).not.toHaveBeenCalled();
  });
});
