import {
  ChallengeNameType,
  CodeMismatchException,
  ExpiredCodeException,
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
    let mockInitiateAuthResponse;
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
        .getUserGateway()
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
      applicationContext
        .getUserGateway()
        .changePassword.mockRejectedValue(
          new Error('User is not in `FORCE_CHANGE_PASSWORD` state'),
        );

      await expect(
        changePasswordInteractor(applicationContext, {
          confirmPassword: mockPassword,
          email: mockEmail,
          password: mockPassword,
          tempPassword: mockPassword,
        }),
      ).rejects.toThrow('User is not in `FORCE_CHANGE_PASSWORD` state');
    });

    describe('and the user has a pending email', () => {
      it('should update the user`s email in persistence and kick off a worker that will generate notices for all their associated cases when the user is NOT a private/irs/or inactive practitioner', async () => {
        applicationContext.getUserGateway().changePassword.mockResolvedValue({
          accessToken: 'dbc7752e-4e86-4ceb-9fa6-43aac18b34a1',
          idToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b206dXNlcklkIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.ASm6CklGr-UD0IFXoqRG7ng8JoXINDTVEsG3BxNU37g',
          refreshToken: '0bc11bcb-efa3-44c6-9880-56210bcad9e2',
        });

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
          applicationContext.getWorkerGateway().queueWork.mock.calls[0][1],
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
          applicationContext.getWorkerGateway().queueWork.mock.calls[0][1],
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
    let mockInitiateAuthResponse;
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
        accessToken: mockToken,
        idToken: mockToken,
        refreshToken: mockToken,
      };

      applicationContext.getUserGateway().getUserByEmail.mockResolvedValue({
        accountStatus: UserStatusType.CONFIRMED,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser['custom:role'],
        userId: mockUser.userId,
      });

      applicationContext
        .getUserGateway()
        .initiateAuth.mockResolvedValue(mockInitiateAuthResponse);
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

    it('should throw an error when initiate auth does not return the correct tokens', async () => {
      const initiateAuthError = new Error('InitiateAuthError');
      initiateAuthError.name = 'InitiateAuthError';
      applicationContext
        .getUserGateway()
        .changePassword.mockRejectedValue(initiateAuthError);

      await expect(
        changePasswordInteractor(applicationContext, {
          code: mockCode,
          confirmPassword: mockPassword,
          email: mockEmail,
          password: mockPassword,
        }),
      ).rejects.toThrow(`Unable to change password for email: ${mockEmail}`);
    });

    it('should throw an InvalidRequest error when initiateAuth returns a CodeMismatchException', async () => {
      applicationContext
        .getUserGateway()
        .changePassword.mockRejectedValue(
          new CodeMismatchException({ $metadata: {}, message: '' }),
        );

      await expect(
        changePasswordInteractor(applicationContext, {
          code: mockCode,
          confirmPassword: mockPassword,
          email: mockEmail,
          password: mockPassword,
        }),
      ).rejects.toThrow('Forgot password code is expired or incorrect');
    });

    it('should throw and error when the change password code has expired', async () => {
      applicationContext
        .getUserGateway()
        .changePassword.mockRejectedValue(
          new ExpiredCodeException({ $metadata: {}, message: '' }),
        );

      await expect(
        changePasswordInteractor(applicationContext, {
          code: mockCode,
          confirmPassword: mockPassword,
          email: mockEmail,
          password: mockPassword,
        }),
      ).rejects.toThrow('Forgot password code is expired or incorrect');
    });

    it('should return the user`s access tokens when their password change is successful', async () => {
      applicationContext.getUserGateway().changePassword.mockResolvedValue({
        accessToken: 'c20c632f-951f-49ac-af04-c2f41873edd4',
        idToken: 'c20c632f-951f-49ac-af04-c2f41873edd4',
        refreshToken: 'c20c632f-951f-49ac-af04-c2f41873edd4',
      });

      const result = await changePasswordInteractor(applicationContext, {
        code: mockCode,
        confirmPassword: mockPassword,
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
});
