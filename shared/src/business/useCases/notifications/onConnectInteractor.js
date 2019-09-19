const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * onConnectInteractor
 *
 */
exports.onConnectInteractor = async ({ applicationContext, connectionId }) => {
  const authorizedUser = applicationContext.getCurrentUser();
  // if (!isAuthorized(authorizedUser, WORKITEM)) {
  //   throw new UnauthorizedError('Unauthorized to assign work item');
  // }

  console.log('user', authorizedUser);

  await applicationContext.getPersistenceGateway().saveUserConnection({
    applicationContext,
    connectionId,
    userId: authorizedUser.userId,
  });
};
