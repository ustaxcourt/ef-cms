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
exports.assignWorkItems = async ({ userId, workItems, applicationContext }) => {
  return applicationContext.getPersistenceGateway().assignWorkItems({
    workItems,
    applicationContext,
  });
};
