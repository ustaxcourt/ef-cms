const {
  isAuthorized,
  GET_CASES_BY_DOCUMENT_ID,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');
const Case = require('../entities/Case');

/**
 * getCasesByDocumentId
 * @param status
 * @param userId
 * @param applicationContext
 * @returns {Promise<Promise<*>|*>}
 */
exports.getCasesByDocumentId = async ({ documentId, applicationContext }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, GET_CASES_BY_DOCUMENT_ID)) {
    throw new UnauthorizedError('Unauthorized for getCasesByStatus');
  }

  const cases = await applicationContext
    .getPersistenceGateway()
    .getCasesByDocumentId({
      documentId,
      applicationContext,
    });

  return Case.validateRawCollection(cases);
};
