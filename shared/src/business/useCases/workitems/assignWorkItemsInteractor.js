const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const WorkItem = require('../../entities/WorkItem');
const Message = require('../../entities/Message');
const { capitalize } = require('lodash');

/**
 * getWorkItem
 *
 * @param userId
 * @param workItemId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.assignWorkItems = async ({ workItems, applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized to assign work item');
  }

  const workItemEntities = await Promise.all(
    workItems.map(workItem => {
      return applicationContext
        .getPersistenceGateway()
        .getWorkItemById({
          applicationContext,
          workItemId: workItem.workItemId,
        })
        .then(fullWorkItem => {
          const workItemEntity = new WorkItem(fullWorkItem);

          workItemEntity
            .assignToUser({
              assigneeId: workItem.assigneeId,
              assigneeName: workItem.assigneeName,
              role: user.role,
              sentBy: user.name,
              sentByUserId: user.userId,
              sentByUserRole: user.role,
            })
            .addMessage(
              new Message({
                createdAt: new Date().toISOString(),
                from: user.name,
                fromUserId: user.userId,
                message: workItemEntity.getLatestMessageEntity().message,
                to: workItem.assigneeName,
                toUserId: workItem.assigneeId,
              }),
            );

          return workItemEntity;
        });
    }),
  );

  await Promise.all(
    workItemEntities.map(workItemEntity => {
      return applicationContext.getPersistenceGateway().saveWorkItem({
        applicationContext,
        workItemToSave: workItemEntity.validate().toRawObject(),
      });
    }),
  );
};
