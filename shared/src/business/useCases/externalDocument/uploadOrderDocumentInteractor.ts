import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 *
 * @param {object} applicationContext application context
 * @param {object} object the argument object
 * @param {string} object.fileIdToOverwrite docket entry id to overwrite
 * @param {object} object.documentFile file object to upload to S3
 * @returns {string} uploaded docket entry id
 */
export const uploadOrderDocumentInteractor = async (
  applicationContext: any,
  {
    documentFile,
    fileIdToOverwrite,
  }: { fileIdToOverwrite: string; documentFile: any },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.COURT_ISSUED_DOCUMENT)) {
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
