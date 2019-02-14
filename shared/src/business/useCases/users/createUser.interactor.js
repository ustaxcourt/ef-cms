const {
  isAuthorized,
  CREATE_USER,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
/**
 * createCase
 *
 * @param petition
 * @param documents
 * @param applicationContext
 * @returns {Promise<*|{caseId}>}
 */
exports.createUser = async ({ user, applicationContext }) => {
  // TODO: Add this back in
  // const requestUser = applicationContext.getCurrentUser();
  // if (!isAuthorized(requestUser, CREATE_USER)) {
  //   throw new UnauthorizedError('Unauthorized');
  // }
  await applicationContext.getPersistenceGateway().createUser({
    user,
    applicationContext,
  });
};
