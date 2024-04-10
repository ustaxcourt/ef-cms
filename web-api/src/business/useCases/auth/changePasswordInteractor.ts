import { ChangePasswordForm } from '@shared/business/entities/ChangePasswordForm';
import { InvalidEntityError, NotFoundError } from '@web-api/errors/errors';
import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import {
  Practitioner,
  RawPractitioner,
} from '@shared/business/entities/Practitioner';
import {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { RawUser, User } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { authErrorHandling } from '@web-api/business/useCases/auth/loginInteractor';
import jwt from 'jsonwebtoken';

export const changePasswordInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    code,
    confirmPassword,
    email,
    password,
    tempPassword,
  }: {
    password: string;
    tempPassword?: string;
    email: string;
    confirmPassword: string;
    code?: string;
  },
): Promise<{ idToken: string; accessToken: string; refreshToken: string }> => {
  try {
    const errors = new ChangePasswordForm({
      confirmPassword,
      email,
      password,
    }).getFormattedValidationErrors();

    if (errors) {
      throw new InvalidEntityError('Change Password Form Entity is invalid');
    }

    if (tempPassword) {
      const result = await applicationContext
        .getUserGateway()
        .changePassword(applicationContext, {
          code: tempPassword,
          email,
          newPassword: password,
        });

      const decoded = jwt.decode(result.idToken);
      const userId = decoded['custom:userId'];

      const userFromPersistence = await applicationContext
        .getPersistenceGateway()
        .getUserById({ applicationContext, userId });

      if (
        userFromPersistence &&
        userFromPersistence.pendingEmail &&
        userFromPersistence.pendingEmail === email
      ) {
        const { updatedUser } = await updateUserPendingEmailRecord(
          applicationContext,
          {
            user: userFromPersistence,
          },
        );

        await applicationContext
          .getWorkerGateway()
          .queueWork(applicationContext, {
            message: {
              payload: { user: updatedUser },
              type: MESSAGE_TYPES.QUEUE_UPDATE_ASSOCIATED_CASES,
              user: updatedUser,
            },
          });
      }

      return result;
    } else {
      const user = await applicationContext
        .getUserGateway()
        .getUserByEmail(applicationContext, { email });

      if (!user) {
        throw new NotFoundError(`User not found with email: ${email}`);
      }

      if (!code) {
        applicationContext.logger.info(
          `Unable to change password for ${email}. No code was provided.`,
        );
        throw new Error('Unable to change password');
      }

      return await applicationContext
        .getUserGateway()
        .changePassword(applicationContext, {
          code,
          email,
          newPassword: password,
        });
    }
  } catch (err: any) {
    if (err.name === 'InitiateAuthError') {
      throw new Error(`Unable to change password for email: ${email}`);
    }

    await authErrorHandling(applicationContext, {
      email,
      error: err,
      sendAccountConfirmation: false,
    });

    throw err;
  }
};

export const updateUserPendingEmailRecord = async (
  applicationContext: ServerApplicationContext,
  { user }: { user: RawUser },
): Promise<{ updatedUser: RawPractitioner | RawUser }> => {
  let userEntity;

  if (
    user.role === ROLES.privatePractitioner ||
    user.role === ROLES.irsPractitioner ||
    user.role === ROLES.inactivePractitioner
  ) {
    userEntity = new Practitioner({
      ...user,
      email: user.pendingEmail,
      pendingEmail: undefined,
      pendingEmailVerificationToken: undefined,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });
  } else {
    userEntity = new User({
      ...user,
      email: user.pendingEmail,
      pendingEmail: undefined,
      pendingEmailVerificationToken: undefined,
    });
  }

  const rawUser = userEntity.validate().toRawObject();
  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: rawUser,
  });

  return { updatedUser: rawUser };
};
