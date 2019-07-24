const {
  CREATE_USER,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * createUserInteractor
 *
 * @param petition
 * @param documents
 * @param applicationContext
 * @returns {Promise<*|{caseId}>}
 */
exports.createUserInteractor = async ({ applicationContext, user }) => {
  const requestUser = applicationContext.getCurrentUser();
  if (!isAuthorized(requestUser, CREATE_USER)) {
    throw new UnauthorizedError('Unauthorized');
  }
  return await applicationContext.getPersistenceGateway().createUser({
    applicationContext,
    user,
  });
};
