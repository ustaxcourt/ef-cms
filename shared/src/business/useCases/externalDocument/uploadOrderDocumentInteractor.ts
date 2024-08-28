import { ClientApplicationContext } from '@web-client/applicationContext';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

/**
 *
 * @param {object} applicationContext application context
 * @param {object} object the argument object
 * @param {string} object.fileIdToOverwrite docket entry id to overwrite
 * @param {object} object.documentFile file object to upload to S3
 * @returns {string} uploaded docket entry id
 */
export const uploadOrderDocumentInteractor = async (
  applicationContext: ClientApplicationContext,
  {
    documentFile,
    fileIdToOverwrite,
  }: { fileIdToOverwrite?: string; documentFile: any },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.COURT_ISSUED_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const orderDocketEntryId = await applicationContext
    .getPersistenceGateway()
    .uploadDocumentFromClient({
      applicationContext,
      document: documentFile,
      key: fileIdToOverwrite,
    });

  return orderDocketEntryId;
};
