const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

/**
 * getWorkItem
 *
 * @param userId
 * @param workItemId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getWorkItem = async ({ applicationContext, workItemId }) => {
  const workItem = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({
      applicationContext,
      workItemId,
    });

  if (!workItem) {
    throw new NotFoundError(`WorkItem ${workItemId} was not found.`);
  }

  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM, workItem.assigneeId)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return new WorkItem(workItem).validate().toRawObject();
};
