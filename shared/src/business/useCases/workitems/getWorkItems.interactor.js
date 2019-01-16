const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

const WorkItemWithCaseInfo = require('./WorkItemWithCaseInfo');

/**
 * getWorkItems
 *
 * @param userId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getWorkItems = async ({ userId, applicationContext }) => {
  if (!isAuthorized(userId, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let workItemsWithCaseInfo = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsForUser({
      userId,
      applicationContext,
    });

  if (!workItemsWithCaseInfo) {
    workItemsWithCaseInfo = [];
  }

  WorkItemWithCaseInfo.validateRawCollection(workItemsWithCaseInfo);

  return workItemsWithCaseInfo;
};
