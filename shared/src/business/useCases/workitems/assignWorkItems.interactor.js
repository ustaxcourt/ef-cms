const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
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
  if (!isAuthorized(userId, WORKITEM)) {
    throw new UnauthorizedError(`Unauthorized to assign work item`);
  }

  const fullWorkItems = await Promise.all(
    workItems.map(workItem => {
      return applicationContext
        .getPersistenceGateway()
        .getWorkItemById({
          workItemId: workItem.workItemId,
          applicationContext,
        })
        .then(fullWorkItem => ({
          ...fullWorkItem,
          ...workItem,
        }));
    }),
  );

  await Promise.all(
    fullWorkItems.map(workItem => {
      return applicationContext.getPersistenceGateway().saveWorkItem({
        workItemToSave: new WorkItem(workItem).validate().toJSON(),
        applicationContext,
      });
    }),
  );
};
