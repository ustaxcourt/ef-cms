import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  calculateDifferenceInHours,
  createISODateString,
} from '@shared/business/utilities/DateHandler';
import { updateUserPendingEmailRecord } from '@web-api/business/useCases/auth/changePasswordInteractor';
import { acquireLock } from '@web-api/persistence/postgres/utils/mutex';
import { getDocketNumbersByUser } from '@web-api/persistence/postgres/users/getDocketNumbersByUser';
import { getUserByPendingEmailVerificationToken } from '@web-api/persistence/postgres/users/getUserByPendingEmailVerificationToken';
import { isAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const TOKEN_EXPIRATION_TIME_HOURS = 24;

export const verifyUserPendingEmailInteractor = async (
  applicationContext: ServerApplicationContext,
  { token }: { token: string },
): Promise<void> => {
  const userToVerify = await getUserByPendingEmailVerificationToken({
    pendingEmailVerificationToken: token,
  });

  if (!userToVerify || !isAuthUser(userToVerify)) {
    applicationContext.logger.info(
      'Unable to verify pending email, there is no user with the provided token',
    );
    throw new UnauthorizedError('Invalid token');
  }

  if (
    userTokenHasExpired(userToVerify.pendingEmailVerificationTokenTimestamp)
  ) {
    applicationContext.logger.info('Pending email verification link expired', {
      email: userToVerify.email,
    });
    throw new UnauthorizedError('Link has expired');
  }

  const isEmailAvailable = await applicationContext
    .getPersistenceGateway()
    .isEmailAvailable({ applicationContext, email: userToVerify.pendingEmail });

  if (!isEmailAvailable) {
    throw new Error('Email is not available');
  }

  const docketNumbers = await getDocketNumbersByUser({
    userId: userToVerify.userId,
  });
  const identifiers = docketNumbers.map(dN => `case|${dN}`);

  const removeLockFunction = await acquireLock({
    applicationContext,
    authorizedUser: userToVerify,
    identifiers,
    retries: 10,
    waitTime: 5000,
  });

  try {
    const { updatedUser } = await updateUserPendingEmailRecord({
      setIsUpdatingInformation: true,
      user: userToVerify,
    });

    await applicationContext.getUserGateway().updateUser(applicationContext, {
      attributesToUpdate: { email: updatedUser.email },
      email: userToVerify.email!,
    });

    await applicationContext.getWorkerGateway().queueWork(applicationContext, {
      message: {
        authorizedUser: userToVerify,
        payload: { user: updatedUser },
        type: MESSAGE_TYPES.QUEUE_EMAIL_UPDATE_ASSOCIATED_CASES,
      },
    });
  } finally {
    await removeLockFunction();
  }
};

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
