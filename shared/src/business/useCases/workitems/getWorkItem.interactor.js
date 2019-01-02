const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');
const WorkItem = require('../../entities/WorkItem');

/**
 * getWorkItem
 *
 * @param userId
 * @param workItemId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getWorkItem = async ({ userId, workItemId, applicationContext }) => {
  const workItem = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({
      workItemId,
      applicationContext,
    });

  if (!workItem) {
    throw new NotFoundError(`WorkItem ${workItemId} was not found.`);
  }

  if (!isAuthorized(userId, WORKITEM, workItem.assigneeId)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return new WorkItem(workItem).validate().toRawObject();
};
