import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  calculateDifferenceInHours,
  createISODateString,
} from '@shared/business/utilities/DateHandler';
import { updateUserPendingEmailRecord } from '@web-api/business/useCases/auth/changePasswordInteractor';
import {
  acquireLock,
  asyncHandleLockError,
} from '@web-api/persistence/postgres/utils/mutex';
import { getDocketNumbersByUser } from '@web-api/persistence/postgres/users/getDocketNumbersByUser';
import { getUserByPendingEmailVerificationToken } from '@web-api/persistence/postgres/users/getUserByPendingEmailVerificationToken';
import { isAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getUserByIdOnceAllUpdatesComplete } from '@web-api/persistence/postgres/users/getUserByIdOnceAllUpdatesComplete';
import { withTransaction } from '@web-api/persistence/postgres/utils/transactions';

export const TOKEN_EXPIRATION_TIME_HOURS = 24;

export const verifyUserPendingEmailInteractor = async (
  applicationContext: ServerApplicationContext,
  { token }: { token: string },
): Promise<void> => {
  const userToVerify = await getUserByPendingEmailVerificationToken({
    pendingEmailVerificationToken: token,
  });

  if (!userToVerify) {
    applicationContext.logger.info(
      'Unable to verify pending email, there is no user with the provided token',
    );
    throw new UnauthorizedError('Invalid token');
  }

  const user = await getUserByIdOnceAllUpdatesComplete({
    userId: userToVerify.userId,
  });

  if (!isAuthUser(user)) {
    applicationContext.logger.info(
      'Unable to verify user pending email, user is not valid',
    );
    throw new UnauthorizedError('Invalid user');
  }

  if (userTokenHasExpired(user.pendingEmailVerificationTokenTimestamp)) {
    applicationContext.logger.info('Pending email verification link expired', {
      email: user.email,
    });
    throw new UnauthorizedError('Link has expired');
  }

  const isEmailAvailable = await applicationContext
    .getPersistenceGateway()
    .isEmailAvailable({ applicationContext, email: user.pendingEmail });

  if (!isEmailAvailable) {
    throw new Error('Email is not available');
  }

  const docketNumbers = await getDocketNumbersByUser({
    userId: user.userId,
  });
  const identifiers = docketNumbers.map(dN => `case|${dN}`);
  // default to no-op in case error is thrown before acquireLock is called
  let removeLockFunction: () => Promise<void> = async () => {};

  try {
    removeLockFunction = await acquireLock({
      applicationContext,
      authorizedUser: user,
      identifiers,
      onLockError: asyncHandleLockError,
    });

    await withTransaction(async () => {
      const { updatedUser } = await updateUserPendingEmailRecord({
        setIsUpdatingInformation: true,
        user,
      });

      await applicationContext.getUserGateway().updateUser(applicationContext, {
        attributesToUpdate: { email: updatedUser.email },
        email: user.email!,
      });

      await applicationContext
        .getWorkerGateway()
        .queueWork(applicationContext, {
          message: {
            authorizedUser: user,
            payload: { user: updatedUser },
            type: MESSAGE_TYPES.QUEUE_EMAIL_UPDATE_ASSOCIATED_CASES,
          },
        });
    });
  } catch (e) {
    applicationContext.logger.error('Error verifying user pending email', {
      error: e,
      token,
      userId: user.userId,
    });
    throw e;
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
