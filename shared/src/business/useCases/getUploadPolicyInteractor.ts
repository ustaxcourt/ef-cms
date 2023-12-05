import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { User } from '../entities/User';

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @returns {Array<string>} the filing type options based on user role
 */
export const getUploadPolicyInteractor = async (
  applicationContext: IApplicationContext,
  { key }: { key: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPLOAD_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  // we don't want external users to be able to overwrite existing s3 files
  if (User.isExternalUser(user.role)) {
    const isFileExists = await applicationContext
      .getPersistenceGateway()
      .isFileExists({
        applicationContext,
        key,
      });

    if (isFileExists) {
      throw new Error('Unauthorized');
    }
  }

  return applicationContext.getPersistenceGateway().getUploadPolicy({
    applicationContext,
    key,
  });
};
