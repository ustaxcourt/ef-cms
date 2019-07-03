const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getDocumentQCInboxForUserInteractor
 *
 * @param section
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDocumentQCInboxForUserInteractor = async ({
  applicationContext,
  userId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCInboxForUser({
      applicationContext,
      userId,
    });

  return workItems.filter(
    workItem =>
      workItem.assigneeId === user.userId && workItem.section === user.section,
  );
};
