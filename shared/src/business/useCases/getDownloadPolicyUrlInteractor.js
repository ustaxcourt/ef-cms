const {
  isAuthorized,
  VIEW_DOCUMENTS,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Array<string>} the filing type options based on user role
 */
exports.getDownloadPolicyUrlInteractor = async ({
  applicationContext,
  documentId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, VIEW_DOCUMENTS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    documentId,
  });
};
