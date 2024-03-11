import {
  InvalidPasswordException,
  NotAuthorizedException,
  UserNotConfirmedException,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  UnauthorizedError,
  UnidentifiedUserError,
} from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { loginInteractor } from '@web-api/business/useCases/auth/loginInteractor';

describe('loginInteractor', () => {
  it('should throw an error when the user attempts to log in and they are in a NEW_PASSWORD_REQUIRED state', async () => {
    const mockEmail = 'petitioner@example.com';
    const mockPassword = 'MyPa$Sword!';
    const mockNewPasswordRequiredError = new Error('NewPasswordRequired');
    mockNewPasswordRequiredError.name = 'NewPasswordRequired';
    applicationContext
      .getUserGateway()
      .initiateAuth.mockRejectedValue(mockNewPasswordRequiredError);

    await expect(
      loginInteractor(applicationContext, {
        email: mockEmail,
        password: mockPassword,
      }),
    ).rejects.toThrow('NewPasswordRequired');
  });

  it('should throw an UnidentifiedUserError error when the user enters the wrong password', async () => {
    const mockEmail = 'petitioner@example.com';
    const mockPassword = 'MyPa$Sword!';
    const mockWrongEmailOrPasswordError = new InvalidPasswordException({
      $metadata: {},
      message: '',
    });
    applicationContext
      .getUserGateway()
      .initiateAuth.mockRejectedValue(mockWrongEmailOrPasswordError);

    await expect(
      loginInteractor(applicationContext, {
        email: mockEmail,
        password: mockPassword,
      }),
    ).rejects.toThrow(UnidentifiedUserError);
  });

  it('should throw an error when the user has too many failed login attempts', async () => {
    const mockEmail = 'petitioner@example.com';
    const mockPassword = 'MyPa$Sword!';
    const mockTooManyAttemptsError = new NotAuthorizedException({
      $metadata: {},
      message: 'Password attempts exceeded',
    });
    applicationContext
      .getUserGateway()
      .initiateAuth.mockRejectedValue(mockTooManyAttemptsError);

    await expect(
      loginInteractor(applicationContext, {
        email: mockEmail,
        password: mockPassword,
      }),
    ).rejects.toThrow(new Error('Password attempts exceeded'));
  });

  it('should throw an UnidentifiedUserError error when the user is not found in persistence with the provided email', async () => {
    const mockEmail = 'petitioner@example.com';
    const mockPassword = 'MyPa$Sword!';
    const mockWrongEmailOrPasswordError = new UserNotFoundException({
      $metadata: {},
      message: '',
    });
    applicationContext
      .getUserGateway()
      .initiateAuth.mockRejectedValue(mockWrongEmailOrPasswordError);

    await expect(
      loginInteractor(applicationContext, {
        email: mockEmail,
        password: mockPassword,
      }),
    ).rejects.toThrow(UnidentifiedUserError);
  });

  it('should re-throw when an error occurs and the error is not caught by any other error handling', async () => {
    const mockEmail = 'petitioner@example.com';
    const mockPassword = 'MyPa$Sword!';
    const mockWrongEmailOrPasswordError = new Error(
      'Totally unexpected, unhandled error.',
    );
    applicationContext
      .getUserGateway()
      .initiateAuth.mockRejectedValue(mockWrongEmailOrPasswordError);

    await expect(
      loginInteractor(applicationContext, {
        email: mockEmail,
        password: mockPassword,
      }),
    ).rejects.toThrow(mockWrongEmailOrPasswordError);
  });

  it('should throw an error when initiateAuth does not return access, id, and refresh tokens', async () => {
    const mockEmail = 'petitioner@example.com';
    const mockPassword = 'MyPa$Sword!';
    const initiateAuthError = new Error('InitiateAuthError');
    initiateAuthError.name = 'InitiateAuthError';
    applicationContext
      .getUserGateway()
      .initiateAuth.mockRejectedValue(initiateAuthError);

    await expect(
      loginInteractor(applicationContext, {
        email: mockEmail,
        password: mockPassword,
      }),
    ).rejects.toThrow('Unsuccessful authentication');
  });

  it('should resend an account confirmation email with a new confirmation code when the user`s account is not confirmed', async () => {
    const mockEmail = 'petitioner@example.com';
    const mockPassword = 'MyPa$Sword!';
    const mockUnconfirmedAccountError = new UserNotConfirmedException({
      $metadata: {},
      message: '',
    });
    applicationContext
      .getUserGateway()
      .initiateAuth.mockRejectedValue(mockUnconfirmedAccountError);
    applicationContext.getUserGateway().getUserByEmail.mockResolvedValue({
      email: mockEmail,
      userId: '6a58e2a9-d2ba-42f1-9a3f-cbd5202af334',
    });

    await expect(
      loginInteractor(applicationContext, {
        email: mockEmail,
        password: mockPassword,
      }),
    ).rejects.toThrow(UnauthorizedError);
    expect(
      applicationContext.getUseCaseHelpers().createUserConfirmation,
    ).toHaveBeenCalled();
  });

  it('should resend a temporary password email with a new temporary password when the user`s temporary password is expired', async () => {
    const mockEmail = 'petitioner@example.com';
    const mockPassword = 'MyPa$Sword!';
    const mockExpiredTemporaryPasswordExpiredError = new NotAuthorizedException(
      {
        $metadata: {},
        message: 'Temporary password has expired',
      },
    );
    applicationContext
      .getUserGateway()
      .initiateAuth.mockRejectedValue(mockExpiredTemporaryPasswordExpiredError);
    applicationContext.getUserGateway().getUserByEmail.mockResolvedValue({
      email: mockEmail,
      userId: '6a58e2a9-d2ba-42f1-9a3f-cbd5202af334',
    });

    await expect(
      loginInteractor(applicationContext, {
        email: mockEmail,
        password: mockPassword,
      }),
    ).rejects.toThrow(new UnauthorizedError('User temporary password expired'));

    expect(
      applicationContext.getUseCaseHelpers().resendTemporaryPassword,
    ).toHaveBeenCalledWith(applicationContext, {
      email: mockEmail,
    });
  });

  it('should throw an error when an account is not found for the provided email when attempting to resend an account confirmation email', async () => {
    const mockEmail = 'petitioner@example.com';
    const mockPassword = 'MyPa$Sword!';
    const mockWrongEmailOrPasswordError = new UserNotConfirmedException({
      $metadata: {},
      message: '',
    });
    applicationContext
      .getUserGateway()
      .initiateAuth.mockRejectedValue(mockWrongEmailOrPasswordError);
    applicationContext
      .getUserGateway()
      .getUserByEmail.mockResolvedValue(undefined);

    await expect(
      loginInteractor(applicationContext, {
        email: mockEmail,
        password: mockPassword,
      }),
    ).rejects.toThrow(
      `Could not find user to re-send confirmation code to. ${mockEmail}`,
    );
  });

  it('should return the access, id, refresh tokens to the user when the user is successfully authenticated', async () => {
    const mockEmail = 'petitioner@example.com';
    const mockPassword = 'MyPa$Sword!';
    const mockSuccessFullLoginResponse = {
      accessToken: 'TEST_ACCESS_TOKEN',
      idToken: 'TEST_ID_TOKEN',
      refreshToken: 'TEST_REFRESH_TOKEN',
    };
    applicationContext
      .getUserGateway()
      .initiateAuth.mockResolvedValue(mockSuccessFullLoginResponse);

    const result = await loginInteractor(applicationContext, {
      email: mockEmail,
      password: mockPassword,
    });

    expect(result).toEqual({
      accessToken: expect.anything(),
      idToken: expect.anything(),
      refreshToken: expect.anything(),
    });
  });
});
