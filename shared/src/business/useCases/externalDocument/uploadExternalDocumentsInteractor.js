const {
  CREATE_COURT_ISSUED_ORDER,
  FILE_EXTERNAL_DOCUMENT,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.uploadExternalDocumentsInteractor = async ({
  applicationContext,
  documentFiles,
  onUploadProgresses,
}) => {
  const user = applicationContext.getCurrentUser();

  if (
    !(
      isAuthorized(user, FILE_EXTERNAL_DOCUMENT) ||
      isAuthorized(user, CREATE_COURT_ISSUED_ORDER)
    )
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  /**
   * produces a promise even if document is not defined
   *
   * @param {object} document the document to be uploaded
   * @param {number} idx the index of the document and progress function
   *
   * @returns {Promise<number|undefined>} resolving to undefined if no document, otherwise the uploaded documentId
   */
  const uploadDocument = (document, idx) => {
    if (!document) {
      return Promise.resolve(undefined);
    }
    return applicationContext.getPersistenceGateway().uploadDocument({
      applicationContext,
      document,
      onUploadProgress: onUploadProgresses[idx],
    });
  };

  documentFiles = documentFiles || [];

  // will produce a possibly sparse array
  const documentIds = await Promise.all(documentFiles.map(uploadDocument));

  return documentIds;
};
