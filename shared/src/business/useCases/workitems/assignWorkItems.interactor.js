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
exports.assignWorkItems = async ({
  userId,
  assigneeId,
  assigneeName,
  workItemIds,
  applicationContext,
}) => {
  return applicationContext.getPersistenceGateway().assignWorkItems({
    assigneeId,
    assigneeName,
    workItemIds,
    applicationContext,
  });
};
