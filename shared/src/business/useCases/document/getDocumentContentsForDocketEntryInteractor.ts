import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 * getDocumentContentsForDocketEntryInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentContentsId document contents id
 * @returns {string} url for the generated document on the storage client
 */
export const getDocumentContentsForDocketEntryInteractor = async (
  applicationContext: IApplicationContext,
  { documentContentsId }: { documentContentsId: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.EDIT_ORDER)) {
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

    const documentContentsData = JSON.parse(documentContentsFile.toString());

    return documentContentsData;
  } catch (e) {
    applicationContext.logger.error(
      `Document contents ${documentContentsId} could not be found in the S3 bucket. ${e}`,
    );
    throw e;
  }
};
