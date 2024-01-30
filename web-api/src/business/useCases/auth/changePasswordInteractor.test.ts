import * as loginAuth from '@web-api/business/useCases/auth/loginInteractor';
import {
  InitiateAuthResponse,
  RespondToAuthChallengeResponse,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  InvalidEntityError,
  InvalidRequest,
  NotFoundError,
} from '../../../errors/errors';
import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { changePasswordInteractor } from './changePasswordInteractor';
import jwt from 'jsonwebtoken';

describe('changePasswordInteractor', () => {
  const mockCode = '123456';
  const mockUserId = '8c2af03d-d736-4561-afe3-c78b67b7cc59';
  const mockSessionId = '0943fbef-a573-484a-8164-a1a5a35f8f3e';
  const mockUserEmail = 'example@example.com';
  const mockPassword = 'Testing1234$';
  const mockUser = {
    'custom:role': ROLES.petitioner,
    'custom:userId': mockUserId,
    name: 'Test Petitioner',
    pendingEmail: mockUserEmail,
    userId: mockUserId,
  };
  const mockToken = jwt.sign(mockUser, 'secret');

  const mockInitiateAuthResponse: InitiateAuthResponse = {
    ChallengeName: 'NEW_PASSWORD_REQUIRED',
    Session: mockSessionId,
  };

  const mockAuthenticationResponse = {
    AuthenticationResult: {
      AccessToken: mockToken,
      IdToken: mockToken,
      RefreshToken: mockToken,
    },
  };

  const mockRespondToAuthChallengeResponse: RespondToAuthChallengeResponse =
    mockAuthenticationResponse;

  const mockAuthErrorHandling = jest.spyOn(loginAuth, 'authErrorHandling');

  beforeAll(() => {
    applicationContext
      .getCognito()
      .initiateAuth.mockResolvedValue(mockInitiateAuthResponse);
    applicationContext
      .getCognito()
      .respondToAuthChallenge.mockResolvedValue(
        mockRespondToAuthChallengeResponse,
      );
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockResolvedValue(mockUser);
    applicationContext
      .getUserGateway()
      .getUserByEmail.mockResolvedValue(mockUser);
    applicationContext
      .getPersistenceGateway()
      .getForgotPasswordCode.mockResolvedValue(mockCode);
  });

  it('should throw an error when the arguments passed are not a valid ChangePasswordForms', async () => {
    await expect(
      changePasswordInteractor(applicationContext, {
        code: mockCode,
        confirmPassword: 'invalid',
        password: 'not valid',
        tempPassword: 'also invalid',
        userEmail: mockUserEmail,
      }),
    ).rejects.toThrow('Change Password Form Entity is invalid');

    expect(applicationContext.getCognito().initiateAuth).not.toHaveBeenCalled();
    expect(
      applicationContext.getCognito().respondToAuthChallenge,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getUserById,
    ).not.toHaveBeenCalled();
    expect(mockAuthErrorHandling.mock.calls[0][1]).toEqual({
      email: mockUserEmail,
      error: new InvalidEntityError('Change Password Form Entity is invalid'),
      sendAccountConfirmation: false,
    });
  });

  it('should initiate response to NEW_PASSWORD_REQUIRED challenge when a temp password is passed, and send a UPDATE_PENDING_EMAIL message using decoded jwt when the user has a pending email', async () => {
    const result = await changePasswordInteractor(applicationContext, {
      confirmPassword: mockPassword,
      password: mockPassword,
      tempPassword: mockPassword,
      userEmail: mockUserEmail,
    });

    expect(applicationContext.getCognito().initiateAuth).toHaveBeenCalledWith({
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        PASSWORD: mockPassword,
        USERNAME: mockUserEmail,
      },
      ClientId: applicationContext.environment.cognitoClientId,
    });

    expect(
      applicationContext.getCognito().respondToAuthChallenge,
    ).toHaveBeenCalledWith({
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ChallengeResponses: {
        NEW_PASSWORD: mockPassword,
        USERNAME: mockUserEmail,
      },
      ClientId: applicationContext.environment.cognitoClientId,
      Session: mockSessionId,
    });
    expect(
      applicationContext.getPersistenceGateway().getUserById,
    ).toHaveBeenCalledWith({ applicationContext, userId: mockUserId });
    expect(
      applicationContext.getWorkerGateway().initialize.mock.calls[0][1],
    ).toEqual({
      message: {
        payload: { user: mockUser },
        type: MESSAGE_TYPES.UPDATE_PENDING_EMAIL,
      },
    });
    expect(result).toEqual({
      accessToken: mockToken,
      idToken: mockToken,
      refreshToken: mockToken,
    });
  });

  it('should throw an error when a temp password has been passed but the user is not in a FORCE_CHANGE_PASSWORD state', async () => {
    applicationContext.getCognito().initiateAuth.mockResolvedValueOnce({
      ChallengeName: 'ADMIN_NO_SRP_AUTH',
      Session: mockSessionId,
    });

    await expect(
      changePasswordInteractor(applicationContext, {
        confirmPassword: mockPassword,
        password: mockPassword,
        tempPassword: mockPassword,
        userEmail: mockUserEmail,
      }),
    ).rejects.toThrow('User is not in `FORCE_CHANGE_PASSWORD` state');

    expect(applicationContext.getCognito().initiateAuth).toHaveBeenCalledTimes(
      1,
    );
    expect(
      applicationContext.getCognito().respondToAuthChallenge,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getUserById,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getWorkerGateway().initialize,
    ).not.toHaveBeenCalled();

    expect(mockAuthErrorHandling.mock.calls[0][1]).toEqual({
      email: mockUserEmail,
      error: new Error('User is not in `FORCE_CHANGE_PASSWORD` state'),
      sendAccountConfirmation: false,
    });
  });

  it('should throw an error when the response to auth challenge is unsuccessful', async () => {
    applicationContext
      .getCognito()
      .respondToAuthChallenge.mockResolvedValueOnce({
        ChallengeName: 'PASSWORD_VERIFIER',
        Session: mockSessionId,
      });
    await expect(
      changePasswordInteractor(applicationContext, {
        confirmPassword: mockPassword,
        password: mockPassword,
        tempPassword: mockPassword,
        userEmail: mockUserEmail,
      }),
    ).rejects.toThrow('Unsuccessful password change');

    expect(applicationContext.getCognito().initiateAuth).toHaveBeenCalledTimes(
      1,
    );
    expect(
      applicationContext.getCognito().respondToAuthChallenge,
    ).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getPersistenceGateway().getUserById,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getWorkerGateway().initialize,
    ).not.toHaveBeenCalled();

    expect(mockAuthErrorHandling.mock.calls[0][1]).toEqual({
      email: mockUserEmail,
      error: new Error('Unsuccessful password change'),
      sendAccountConfirmation: false,
    });
  });

  it('should update user password when no temp password is passed and confirmation code is valid', async () => {
    applicationContext
      .getCognito()
      .initiateAuth.mockResolvedValueOnce(mockAuthenticationResponse);

    const result = await changePasswordInteractor(applicationContext, {
      code: mockCode,
      confirmPassword: mockPassword,
      password: mockPassword,
      userEmail: mockUserEmail,
    });

    expect(
      applicationContext.getUserGateway().getUserByEmail.mock.calls[0][1],
    ).toEqual({ email: mockUserEmail });

    expect(
      applicationContext.getPersistenceGateway().getForgotPasswordCode.mock
        .calls[0][1],
    ).toEqual({
      userId: mockUserId,
    });

    expect(
      applicationContext.getCognito().adminSetUserPassword,
    ).toHaveBeenCalledWith({
      Password: mockPassword,
      Permanent: true,
      UserPoolId: applicationContext.environment.userPoolId,
      Username: mockUserEmail,
    });

    expect(applicationContext.getCognito().initiateAuth).toHaveBeenCalledWith({
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        PASSWORD: mockPassword,
        USERNAME: mockUserEmail,
      },
      ClientId: applicationContext.environment.cognitoClientId,
    });

    expect(result).toEqual({
      accessToken: mockToken,
      idToken: mockToken,
      refreshToken: mockToken,
    });
  });

  it('should throw an error when no temp password is passed and the user cannot by found via email', async () => {
    applicationContext
      .getUserGateway()
      .getUserByEmail.mockResolvedValueOnce(undefined);
    await expect(
      changePasswordInteractor(applicationContext, {
        code: mockCode,
        confirmPassword: mockPassword,
        password: mockPassword,
        userEmail: mockUserEmail,
      }),
    ).rejects.toThrow(`User not found with email: ${mockUserEmail}`);

    expect(
      applicationContext.getUserGateway().getUserByEmail,
    ).toHaveBeenCalledTimes(1);
    expect(applicationContext.getCognito().initiateAuth).not.toHaveBeenCalled();
    expect(
      applicationContext.getWorkerGateway().initialize,
    ).not.toHaveBeenCalled();

    expect(mockAuthErrorHandling.mock.calls[0][1]).toEqual({
      email: mockUserEmail,
      error: new NotFoundError(`User not found with email: ${mockUserEmail}`),
      sendAccountConfirmation: false,
    });
  });

  it('should throw an error when the forgot password code has expired', async () => {
    applicationContext
      .getPersistenceGateway()
      .getForgotPasswordCode.mockResolvedValueOnce(undefined);

    await expect(
      changePasswordInteractor(applicationContext, {
        code: mockCode,
        confirmPassword: mockPassword,
        password: mockPassword,
        userEmail: mockUserEmail,
      }),
    ).rejects.toThrow('Forgot password code expired');

    expect(
      applicationContext.getUserGateway().getUserByEmail,
    ).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getCognito().adminSetUserPassword,
    ).not.toHaveBeenCalled();
    expect(applicationContext.getCognito().initiateAuth).not.toHaveBeenCalled();
    expect(
      applicationContext.getWorkerGateway().initialize,
    ).not.toHaveBeenCalled();

    expect(mockAuthErrorHandling.mock.calls[0][1]).toEqual({
      email: mockUserEmail,
      error: new InvalidRequest('Forgot password code expired'),
      sendAccountConfirmation: false,
    });
  });
});
