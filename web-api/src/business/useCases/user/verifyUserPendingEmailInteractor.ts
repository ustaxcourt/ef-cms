import { Connection } from '@web-api/notifications/sendNotificationToConnection';
import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  calculateDifferenceInHours,
  createISODateString,
} from '@shared/business/utilities/DateHandler';
import { getConnection } from 'web-client/integration-tests/helpers';
import { updateUserPendingEmailRecord } from '@web-api/business/useCases/auth/changePasswordInteractor';

export const TOKEN_EXPIRATION_TIME_HOURS = 24;

export const userTokenHasExpired = (
  tokenExpirationTimestamp?: string,
): boolean => {
  if (!tokenExpirationTimestamp) {
    return true;
  }
  return (
    calculateDifferenceInHours(
      createISODateString(),
      tokenExpirationTimestamp,
    ) > TOKEN_EXPIRATION_TIME_HOURS
  );
};

export const verifyUserPendingEmailInteractor = async (
  applicationContext: ServerApplicationContext,
  { clientConnectionId, token }: { token: string; clientConnectionId: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)) {
    const connection: Connection = getConnection(clientConnectionId);
    return await applicationContext
      .getNotificationGateway()
      .sendNotificationToConnection({
        applicationContext,
        connection,
        messageStringified: JSON.stringify({
          action: 'set_verify_email_notification',
          message: 'Unauthorized to manage emails.',
        }),
      });
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserByIdOnceAllUpdatesComplete({
      applicationContext,
      userId: authorizedUser.userId,
    });

  if (
    !user.pendingEmailVerificationToken ||
    user.pendingEmailVerificationToken !== token
  ) {
    applicationContext.logger.info(
      'Unable to verify pending email, either the user clicked the verify link twice or their verification token did not match',
      { email: authorizedUser.email },
    );
    return await applicationContext
      .getNotificationGateway()
      .sendNotificationToUser({
        applicationContext,
        clientConnectionId,
        message: {
          action: 'set_verify_email_notification',
          message: 'Tokens do not match',
        },
        userId: user.userId,
      });
  }

  if (userTokenHasExpired(user.pendingEmailVerificationTokenTimestamp)) {
    applicationContext.logger.info('Pending email verification link expired', {
      email: authorizedUser.email,
    });
    return await applicationContext
      .getNotificationGateway()
      .sendNotificationToUser({
        applicationContext,
        clientConnectionId,
        message: {
          action: 'set_verify_email_notification',
          messageType: 'expiredToken',
        },
        userId: user.userId,
      });
  }

  const isEmailAvailable = await applicationContext
    .getPersistenceGateway()
    .isEmailAvailable({
      applicationContext,
      email: user.pendingEmail,
    });

  if (!isEmailAvailable) {
    return await applicationContext
      .getNotificationGateway()
      .sendNotificationToUser({
        applicationContext,
        clientConnectionId,
        message: {
          action: 'set_verify_email_notification',
          message: 'Email is not available',
        },
        userId: user.userId,
      });
  }

  const { updatedUser } = await updateUserPendingEmailRecord(
    applicationContext,
    {
      setIsUpdatingInformation: true,
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

  try {
    const expectedUpdatedCaseCount = (
      await applicationContext.getPersistenceGateway().getDocketNumbersByUser({
        applicationContext,
        userId: user.userId,
      })
    ).length;

    let checkCount = true;
    while (checkCount) {
      await applicationContext.getUtilities().sleep(1500);
      const actualUpdatedCaseCount = await applicationContext
        .getPersistenceGateway()
        .getCasesByEmailTotal({
          applicationContext,
          email: updatedUser.email!,
        });

      if (actualUpdatedCaseCount === expectedUpdatedCaseCount)
        checkCount = false;
    }

    updatedUser.isUpdatingInformation = false;
    await applicationContext.getPersistenceGateway().updateUser({
      applicationContext,
      user: updatedUser,
    });
  } catch (e) {
    updatedUser.isUpdatingInformation = false;
    await applicationContext.getPersistenceGateway().updateUser({
      applicationContext,
      user: updatedUser,
    });
  }

  return await applicationContext
    .getNotificationGateway()
    .sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'set_verify_email_notification',
        messageType: 'success',
      },
      userId: user.userId,
    });
};
