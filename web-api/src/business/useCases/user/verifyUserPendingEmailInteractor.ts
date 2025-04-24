import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  calculateDifferenceInHours,
  createISODateString,
} from '@shared/business/utilities/DateHandler';
import { updateUserPendingEmailRecord } from '@web-api/business/useCases/auth/changePasswordInteractor';
import {
  asyncHandleLockError,
  withLocking,
} from '@web-api/business/useCaseHelper/acquireLock';
import { getUserByIdOnceAllUpdatesComplete } from '@web-api/persistence/postgres/users/getUserByIdOnceAllUpdatesComplete';
import { updateUser } from '@web-api/gateways/user/updateUser';
import { getDocketNumbersByUser } from '@web-api/persistence/postgres/users/cases/getCasesForUser';

export const TOKEN_EXPIRATION_TIME_HOURS = 24;

export const verifyUserPendingEmail = async (
  applicationContext: ServerApplicationContext,
  { token }: { token: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)) {
    throw new UnauthorizedError('Unauthorized to manage emails.');
  }

  const user = await getUserByIdOnceAllUpdatesComplete({
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
    throw new UnauthorizedError('Tokens do not match');
  }

  if (userTokenHasExpired(user.pendingEmailVerificationTokenTimestamp)) {
    applicationContext.logger.info('Pending email verification link expired', {
      email: authorizedUser.email,
    });
    throw new UnauthorizedError('Link has expired');
  }

  const isEmailAvailable = await applicationContext
    .getPersistenceGateway()
    .isEmailAvailable({ applicationContext, email: user.pendingEmail });

  if (!isEmailAvailable) {
    throw new Error('Email is not available');
  }

  const { updatedUser } = await updateUserPendingEmailRecord({
    setIsUpdatingInformation: true,
    user,
  });

  await updateUser(applicationContext, {
    attributesToUpdate: { email: updatedUser.email },
    email: user.email!,
  });

  await applicationContext.getWorkerGateway().queueWork(applicationContext, {
    message: {
      authorizedUser,
      payload: { user: updatedUser },
      type: MESSAGE_TYPES.QUEUE_EMAIL_UPDATE_ASSOCIATED_CASES,
    },
  });
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

export const verifyUserPendingEmailInteractor = withLocking(
  verifyUserPendingEmail,
  async (_applicationContext, _, authorizedUser) => {
    if (!authorizedUser?.userId) {
      throw new Error('No authorized User when attempting to lock');
    }
    const docketNumbers = await getDocketNumbersByUser({
      userId: authorizedUser.userId,
    });
    const identifiers = docketNumbers.map(dN => `case|${dN}`);

    return { identifiers };
  },
  asyncHandleLockError,
);
