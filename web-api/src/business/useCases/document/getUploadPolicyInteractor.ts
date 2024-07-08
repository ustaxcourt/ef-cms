import { PresignedPost } from '@aws-sdk/s3-presigned-post';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '../../../../../shared/src/business/entities/User';

export const getUploadPolicyInteractor = async (
  applicationContext: ServerApplicationContext,
  { key }: { key: string },
  authorizedUser: UnknownAuthUser,
): Promise<PresignedPost> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPLOAD_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  // we don't want external users to be able to overwrite existing s3 files
  if (User.isExternalUser(authorizedUser.role)) {
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
