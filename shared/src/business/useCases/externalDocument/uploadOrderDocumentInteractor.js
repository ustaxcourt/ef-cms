const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param {object} applicationContext application context
 * @param {object} object the argument object
 * @param {string} object.docketEntryIdToOverwrite docket entry id to overwrite
 * @param {object} object.documentFile file object to upload to S3
 * @returns {string} uploaded docket entry id
 */
exports.uploadOrderDocumentInteractor = async (
  applicationContext,
  { docketEntryIdToOverwrite, documentFile },
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
      key: docketEntryIdToOverwrite,
      onUploadProgress: () => {},
    });

  return orderDocketEntryId;
};
