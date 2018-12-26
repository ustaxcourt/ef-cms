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

  const workItemEntities = await Promise.all(
    workItems.map(workItem => {
      return applicationContext
        .getPersistenceGateway()
        .getWorkItemById({
          workItemId: workItem.workItemId,
          applicationContext,
        })
        .then(fullWorkItem =>
          new WorkItem(fullWorkItem).assignToUser({
            assigneeId: workItem.assigneeId,
            assigneeName: workItem.assigneeName,
          }),
        );
    }),
  );

  await Promise.all(
    workItemEntities.map(workItemEntity => {
      console.log(workItemEntity.toJSON());
      return applicationContext.getPersistenceGateway().saveWorkItem({
        workItemToSave: workItemEntity.validate().toJSON(),
        applicationContext,
      });
    }),
  );
};
