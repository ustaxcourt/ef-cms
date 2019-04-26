const {
  isAuthorized,
  FILE_EXTERNAL_DOCUMENT,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/Case');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.submitCaseAssociationRequest = async ({
  applicationContext,
  caseId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, FILE_EXTERNAL_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }
};
