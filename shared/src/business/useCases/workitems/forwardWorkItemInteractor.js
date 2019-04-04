const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { Message } = require('../../entities/Message');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');
const { WorkItem } = require('../../entities/WorkItem');

/**
 *
 * @param workItemId
 * @param assigneeId
 * @param message
 * @param applicationContext
 * @returns {Promise<Promise<*>|*|Promise<*>|Promise<*>|Promise<*>|Promise<null>>}
 */
exports.forwardWorkItem = async ({
  workItemId,
  assigneeId,
  message,
  applicationContext,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized for assign work item');
  }

  const userToForwardTo = new User(
    await applicationContext
      .getPersistenceGateway()
      .getUserById({ applicationContext, userId: assigneeId }),
  );

  const workItemToForward = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({
      applicationContext,
      workItemId: workItemId,
    })
    .then(fullWorkItem =>
      new WorkItem(fullWorkItem)
        .assignToUser({
          assigneeId: userToForwardTo.userId,
          assigneeName: userToForwardTo.name,
          role: userToForwardTo.role,
          sentBy: user.name,
          sentByUserId: user.userId,
          sentByUserRole: user.role,
        })
        .addMessage(
          new Message({
            createdAt: new Date().toISOString(),
            from: user.name,
            fromUserId: user.userId,
            message,
            to: userToForwardTo.name,
            toUserId: userToForwardTo.userId,
          }),
        ),
    );

  return applicationContext.getPersistenceGateway().saveWorkItem({
    applicationContext,
    createOutboxEntries: true,
    workItemToSave: workItemToForward.validate().toRawObject(),
  });
};
