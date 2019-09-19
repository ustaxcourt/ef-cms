const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * onDisconnectInteractor
 */
exports.onDisconnectInteractor = async ({
  applicationContext,
  connectionId,
}) => {
  // const authorizedUser = applicationContext.getCurrentUser();
  // if (!isAuthorized(authorizedUser, WORKITEM)) {
  //   throw new UnauthorizedError('Unauthorized to assign work item');
  // }

  const authorizedUser = applicationContext.getCurrentUser();
  // if (!isAuthorized(authorizedUser, WORKITEM)) {
  //   throw new UnauthorizedError('Unauthorized to assign work item');
  // }

  await applicationContext.getPersistenceGateway().deleteUserConnection({
    applicationContext,
    connectionId,
    userId: authorizedUser.userId,
  });
};
