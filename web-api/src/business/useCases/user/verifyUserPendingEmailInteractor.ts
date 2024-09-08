import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '../../../errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { updateUserPendingEmailRecord } from '@web-api/business/useCases/auth/changePasswordInteractor';

export const verifyUserPendingEmailInteractor = async (
  applicationContext: ServerApplicationContext,
  { token }: { token: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)) {
    throw new UnauthorizedError('Unauthorized to manage emails.');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  if (
    !user.pendingEmailVerificationToken ||
    user.pendingEmailVerificationToken !== token
  ) {
    applicationContext.logger.info(
      'Unable to verify pending email, either the user clicked the verify link twice or their verification token did not match',
      { email: authorizedUser.email },
    );
    throw new UnauthorizedError('Tokens do not match');
  }

  const isEmailAvailable = await applicationContext
    .getPersistenceGateway()
    .isEmailAvailable({
      applicationContext,
      email: user.pendingEmail,
    });

  if (!isEmailAvailable) {
    throw new Error('Email is not available');
  }

  const { updatedUser } = await updateUserPendingEmailRecord(
    applicationContext,
    {
      user,
    },
  );

  await applicationContext.getUserGateway().updateUser(applicationContext, {
    attributesToUpdate: {
      email: updatedUser.email,
    },
    email: user.email,
  });

  await applicationContext.getWorkerGateway().queueWork(applicationContext, {
    message: {
      authorizedUser,
      payload: { user: updatedUser },
      type: MESSAGE_TYPES.QUEUE_UPDATE_ASSOCIATED_CASES,
    },
  });
};
