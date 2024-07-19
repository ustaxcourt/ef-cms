import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const getDocumentContentsForDocketEntryInteractor = async (
  applicationContext: ServerApplicationContext,
  { documentContentsId }: { documentContentsId: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EDIT_ORDER)) {
    throw new UnauthorizedError('Unauthorized');
  }

  try {
    const documentContentsFile = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        key: documentContentsId,
        useTempBucket: false,
      });

    const documentContentsData = JSON.parse(
      new TextDecoder('utf-8').decode(documentContentsFile),
    );

    return documentContentsData;
  } catch (e) {
    applicationContext.logger.error(
      `Document contents ${documentContentsId} could not be found in the S3 bucket. ${e}`,
    );
    throw e;
  }
};
