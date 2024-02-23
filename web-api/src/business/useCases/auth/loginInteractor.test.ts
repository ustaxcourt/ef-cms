import {
  ChallengeNameType,
  InitiateAuthCommandOutput,
  InvalidPasswordException,
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
    const mockNewPasswordRequiredResponse: InitiateAuthCommandOutput = {
      $metadata: {},
      ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
    };
    applicationContext
      .getCognito()
      .initiateAuth.mockResolvedValue(mockNewPasswordRequiredResponse);

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
      .getCognito()
      .initiateAuth.mockRejectedValue(mockWrongEmailOrPasswordError);

    await expect(
      loginInteractor(applicationContext, {
        email: mockEmail,
        password: mockPassword,
      }),
    ).rejects.toThrow(UnidentifiedUserError);
  });

  it('should throw an UnidentifiedUserError error when the user is not found in persistence with the provided email', async () => {
    const mockEmail = 'petitioner@example.com';
    const mockPassword = 'MyPa$Sword!';
    const mockWrongEmailOrPasswordError = new UserNotFoundException({
      $metadata: {},
      message: '',
    });
    applicationContext
      .getCognito()
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
      .getCognito()
      .initiateAuth.mockRejectedValue(mockWrongEmailOrPasswordError);

    await expect(
      loginInteractor(applicationContext, {
        email: mockEmail,
        password: mockPassword,
      }),
    ).rejects.toThrow(mockWrongEmailOrPasswordError);
  });

  it('should throw an error if initiateAuth does not return access, id, and refresh tokens', async () => {
    const mockEmail = 'petitioner@example.com';
    const mockPassword = 'MyPa$Sword!';
    applicationContext
      .getCognito()
      .initiateAuth.mockResolvedValue({ AuthenticationResult: {} });

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
    const mockWrongEmailOrPasswordError = new UserNotConfirmedException({
      $metadata: {},
      message: '',
    });
    applicationContext
      .getCognito()
      .initiateAuth.mockRejectedValue(mockWrongEmailOrPasswordError);
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
  });

  it('should throw an error when an account is not found for the provided email when attempting to resent an account confirmation email', async () => {
    const mockEmail = 'petitioner@example.com';
    const mockPassword = 'MyPa$Sword!';
    const mockWrongEmailOrPasswordError = new UserNotConfirmedException({
      $metadata: {},
      message: '',
    });
    applicationContext
      .getCognito()
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
    const mockSuccessFullLoginResponse: InitiateAuthCommandOutput = {
      $metadata: {},
      AuthenticationResult: {
        AccessToken: 'TEST_ACCESS_TOKEN',
        IdToken: 'TEST_ID_TOKEN',
        RefreshToken: 'TEST_REFRESH_TOKEN',
      },
    };
    applicationContext
      .getCognito()
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
