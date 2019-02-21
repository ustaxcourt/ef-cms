const {
  isAuthorized,
  GET_CASES_BY_DOCUMENT_ID,
  GET_CASES_BY_STATUS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const Case = require('../../entities/Case');

/**
 * queryForCases
 * @param status
 * @param userId
 * @param applicationContext
 * @returns {Promise<Promise<*>|*>}
 */
exports.queryForCases = async ({ status, documentId, applicationContext }) => {
  let cases = [];
  const user = applicationContext.getCurrentUser();

  if (documentId) {
    if (!isAuthorized(user, GET_CASES_BY_DOCUMENT_ID)) {
      throw new UnauthorizedError('Unauthorized for getCasesByDocument');
    }
    cases = await applicationContext
      .getPersistenceGateway()
      .getCasesByDocumentId({
        documentId,
        applicationContext,
      });
  } else if (status) {
    if (!isAuthorized(user, GET_CASES_BY_STATUS)) {
      throw new UnauthorizedError('Unauthorized for getCasesByStatus');
    }

    status = status.toLowerCase();
    cases = await applicationContext.getPersistenceGateway().getCasesByStatus({
      status,
      applicationContext,
    });
  } else {
    cases = await applicationContext.getPersistenceGateway().getCasesByUser({
      user,
      applicationContext,
    });
  }

  return Case.validateRawCollection(cases);
};
