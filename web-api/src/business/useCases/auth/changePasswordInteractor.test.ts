import {
  AuthFlowType,
  ChallengeNameType,
  InitiateAuthResponse,
  RespondToAuthChallengeResponse,
  UserStatusType,
} from '@aws-sdk/client-cognito-identity-provider';
import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import { MOCK_PRACTITIONER } from '@shared/test/mockUsers';
import {
  ROLES,
  Role,
  SERVICE_INDICATOR_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { UserRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { changePasswordInteractor } from './changePasswordInteractor';
import jwt from 'jsonwebtoken';

describe('changePasswordInteractor', () => {
  const mockUserId = '8c2af03d-d736-4561-afe3-c78b67b7cc59';
  const mockEmail = 'example@example.com';
  const mockPassword = 'Testing1234$';
  const mockToken = jwt.sign('abcdef', 'secret');

  it('should throw an error when the change password request is invalid', async () => {
    await expect(
      changePasswordInteractor(applicationContext, {
        confirmPassword: 'invalid',
        email: mockEmail,
        password: 'not valid',
        tempPassword: 'also invalid',
      }),
    ).rejects.toThrow('Change Password Form Entity is invalid');
  });

  describe('when the user is attempting to log in with a temporary password', () => {
    let mockInitiateAuthResponse: InitiateAuthResponse;
    let mockRespondToAuthChallengeResponse: RespondToAuthChallengeResponse;
    let mockUserWithPendingEmail: UserRecord;

    beforeEach(() => {
      mockInitiateAuthResponse = {
        ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
        Session: '0943fbef-a573-484a-8164-a1a5a35f8f3e',
      };

      mockRespondToAuthChallengeResponse = {
        AuthenticationResult: {
          AccessToken: mockToken,
          IdToken: mockToken,
          RefreshToken: mockToken,
        },
      };

      mockUserWithPendingEmail = {
        entityName: 'User',
        name: 'Test Petitioner',
        pendingEmail: mockEmail,
        pk: `user|${mockUserId}`,
        role: ROLES.petitioner,
        sk: `user|${mockUserId}`,
        userId: mockUserId,
      };

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
        .getUserById.mockImplementation(() => mockUserWithPendingEmail);
    });

    it('should throw an error when the user is NOT in NEW_PASSWORD_REQUIRED state', async () => {
      mockInitiateAuthResponse = {
        AuthenticationResult: {},
      };
      applicationContext
        .getCognito()
        .initiateAuth.mockResolvedValue(mockInitiateAuthResponse);

      await expect(
        changePasswordInteractor(applicationContext, {
          confirmPassword: mockPassword,
          email: mockEmail,
          password: mockPassword,
          tempPassword: mockPassword,
        }),
      ).rejects.toThrow('User is not in `FORCE_CHANGE_PASSWORD` state');

      expect(applicationContext.getCognito().initiateAuth).toHaveBeenCalledWith(
        {
          AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
          AuthParameters: {
            PASSWORD: mockPassword,
            USERNAME: mockEmail,
          },
          ClientId: applicationContext.environment.cognitoClientId,
        },
      );
    });

    it('should update the user`s password in persistence when they are in NEW_PASSWORD_REQUIRED state and their change password request is valid', async () => {
      await changePasswordInteractor(applicationContext, {
        confirmPassword: mockPassword,
        email: mockEmail,
        password: mockPassword,
        tempPassword: mockPassword,
      });

      expect(
        applicationContext.getCognito().respondToAuthChallenge,
      ).toHaveBeenCalledWith({
        ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
        ChallengeResponses: {
          NEW_PASSWORD: mockPassword,
          USERNAME: mockEmail,
        },
        ClientId: applicationContext.environment.cognitoClientId,
        Session: mockInitiateAuthResponse.Session,
      });
    });

    it('should throw an error when updating the user`s password in persistence fails for some reason and therefore does NOT return their access tokens', async () => {
      applicationContext.getCognito().respondToAuthChallenge.mockResolvedValue({
        // intentionally empty response
      });

      await expect(
        changePasswordInteractor(applicationContext, {
          confirmPassword: mockPassword,
          email: mockEmail,
          password: mockPassword,
          tempPassword: mockPassword,
        }),
      ).rejects.toThrow('Unsuccessful password change');
    });

    describe('and the user has a pending email', () => {
      it('should update the user`s email in persistence and kick off a worker that will generate notices for all their associated cases when the user is NOT a private/irs/or inactive practitioner', async () => {
        await changePasswordInteractor(applicationContext, {
          confirmPassword: mockPassword,
          email: mockEmail,
          password: mockPassword,
          tempPassword: mockPassword,
        });

        expect(
          applicationContext.getPersistenceGateway().updateUser.mock
            .calls[0][0],
        ).toMatchObject({
          user: {
            email: mockUserWithPendingEmail.pendingEmail,
            pendingEmail: undefined,
            pendingEmailVerificationToken: undefined,
          },
        });
        expect(
          applicationContext.getWorkerGateway().initialize.mock.calls[0][1],
        ).toMatchObject({
          message: {
            payload: {
              user: {
                email: mockUserWithPendingEmail.pendingEmail,
                pendingEmail: undefined,
                pendingEmailVerificationToken: undefined,
              },
            },
            type: MESSAGE_TYPES.QUEUE_UPDATE_ASSOCIATED_CASES,
          },
        });
      });

      it('should update the user`s service preference to electronic, update the user`s email in persistence, and kick off a worker that will generate notices for all their associated cases when the user is a private/irs/or inactive practitioner', async () => {
        mockUserWithPendingEmail = {
          ...MOCK_PRACTITIONER,
          pendingEmail: mockEmail,
          pk: `user|${mockUserId}`,
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          sk: `user|${mockUserId}`,
          userId: mockUserId, // Explicitly set to paper to verify it changes to electronic once pending email is confirmed
        };

        await changePasswordInteractor(applicationContext, {
          confirmPassword: mockPassword,
          email: mockEmail,
          password: mockPassword,
          tempPassword: mockPassword,
        });

        expect(
          applicationContext.getPersistenceGateway().updateUser.mock
            .calls[0][0],
        ).toMatchObject({
          user: {
            email: mockUserWithPendingEmail.pendingEmail,
            pendingEmail: undefined,
            pendingEmailVerificationToken: undefined,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          },
        });
        expect(
          applicationContext.getWorkerGateway().initialize.mock.calls[0][1],
        ).toMatchObject({
          message: {
            payload: {
              user: {
                email: mockUserWithPendingEmail.pendingEmail,
                pendingEmail: undefined,
                pendingEmailVerificationToken: undefined,
              },
            },
            type: MESSAGE_TYPES.QUEUE_UPDATE_ASSOCIATED_CASES,
          },
        });
      });
    });

    it('should return the user`s access tokens when their password change is successful', async () => {
      const result = await changePasswordInteractor(applicationContext, {
        confirmPassword: mockPassword,
        email: mockEmail,
        password: mockPassword,
        tempPassword: mockPassword,
      });

      expect(result).toEqual({
        accessToken: expect.anything(),
        idToken: expect.anything(),
        refreshToken: expect.anything(),
      });
    });
  });

  describe('when the user is attempting to log in with a forgot password code', () => {
    let mockInitiateAuthResponse: InitiateAuthResponse;
    let mockUser: {
      userId: string;
      email: string;
      accountStatus: UserStatusType;
      role: Role;
      name: string;
    };

    const mockCode = 'bbc953fd-d624-45b0-9766-288a9d1d6bf4';

    beforeEach(() => {
      mockUser = {
        accountStatus: UserStatusType.CONFIRMED,
        email: mockEmail,
        name: 'Test Petitioner',
        role: ROLES.petitioner,
        userId: mockUserId,
      };

      mockInitiateAuthResponse = {
        AuthenticationResult: {
          AccessToken: mockToken,
          IdToken: mockToken,
          RefreshToken: mockToken,
        },
      };

      applicationContext.getUserGateway().getUserByEmail.mockResolvedValue({
        accountStatus: UserStatusType.CONFIRMED,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser['custom:role'],
        userId: mockUser.userId,
      });

      applicationContext
        .getPersistenceGateway()
        .getForgotPasswordCode.mockResolvedValue(mockCode);

      applicationContext
        .getCognito()
        .initiateAuth.mockResolvedValueOnce(mockInitiateAuthResponse);
    });

    it('should throw an error when a user with the email provided is not found in persistence', async () => {
      applicationContext
        .getUserGateway()
        .getUserByEmail.mockResolvedValue(undefined);

      await expect(
        changePasswordInteractor(applicationContext, {
          code: mockCode,
          confirmPassword: mockPassword,
          email: mockEmail,
          password: mockPassword,
        }),
      ).rejects.toThrow(`User not found with email: ${mockEmail}`);
    });

    it('should throw an error when the forgot password code has expired', async () => {
      applicationContext
        .getPersistenceGateway()
        .getForgotPasswordCode.mockResolvedValue(undefined);

      await expect(
        changePasswordInteractor(applicationContext, {
          code: mockCode,
          confirmPassword: mockPassword,
          email: mockEmail,
          password: mockPassword,
        }),
      ).rejects.toThrow('Forgot password code expired');
    });

    it('should update user password when the forgot password code is valid and return the user`s access tokens', async () => {
      const result = await changePasswordInteractor(applicationContext, {
        code: mockCode,
        confirmPassword: mockPassword,
        email: mockEmail,
        password: mockPassword,
      });

      expect(
        applicationContext.getCognito().adminSetUserPassword,
      ).toHaveBeenCalledWith({
        Password: mockPassword,
        Permanent: true,
        UserPoolId: applicationContext.environment.userPoolId,
        Username: mockEmail,
      });
      expect(applicationContext.getCognito().initiateAuth).toHaveBeenCalledWith(
        {
          AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
          AuthParameters: {
            PASSWORD: mockPassword,
            USERNAME: mockEmail,
          },
          ClientId: applicationContext.environment.cognitoClientId,
        },
      );
      expect(result).toEqual({
        accessToken: mockToken,
        idToken: mockToken,
        refreshToken: mockToken,
      });
    });
  });
});
