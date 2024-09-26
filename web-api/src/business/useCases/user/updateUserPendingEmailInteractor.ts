import { Practitioner } from '../../../../../shared/src/business/entities/Practitioner';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '../../../../../shared/src/business/entities/User';
import { createISODateString } from '@shared/business/utilities/DateHandler';

/**
 * updateUserPendingEmailInteractor
 * Allows a user to request an update their own email address if they have permission.
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.pendingEmail the pending email
 * @returns {Promise} the updated user object
 */
export const updateUserPendingEmailInteractor = async (
  applicationContext: ServerApplicationContext,
  { pendingEmail }: { pendingEmail: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)) {
    throw new UnauthorizedError('Unauthorized to manage emails.');
  }

  const isEmailAvailable = await applicationContext
    .getPersistenceGateway()
    .isEmailAvailable({
      applicationContext,
      email: pendingEmail,
    });

  if (!isEmailAvailable) {
    throw new Error('Email is not available');
  }

  const user: any = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  user.pendingEmail = pendingEmail;

  const pendingEmailVerificationToken = applicationContext.getUniqueId();
  user.pendingEmailVerificationToken = pendingEmailVerificationToken;
  user.pendingEmailVerificationTokenTimestamp = createISODateString();

  let updatedUserRaw;
  if (user.role === ROLES.petitioner) {
    updatedUserRaw = new User(user).validate().toRawObject();
  } else {
    updatedUserRaw = new Practitioner(user).validate().toRawObject();
  }

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: updatedUserRaw,
  });

  await applicationContext.getUseCaseHelpers().sendEmailVerificationLink({
    applicationContext,
    pendingEmail,
    pendingEmailVerificationToken,
  });

  return updatedUserRaw;
};
