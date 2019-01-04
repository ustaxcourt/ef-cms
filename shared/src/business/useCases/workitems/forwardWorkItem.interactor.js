const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const WorkItem = require('../../entities/WorkItem');
const Message = require('../../entities/Message');
const User = require('../../entities/User');

exports.forwardWorkItem = async ({
  userId,
  workItemId,
  assigneeId,
  message,
  applicationContext,
}) => {
  const user = applicationContext.user;

  if (!isAuthorized(user.userId, WORKITEM)) {
    throw new UnauthorizedError(`Unauthorized to assign work item`);
  }

  const userToForwardTo = new User({ userId: assigneeId });

  const workItemToForward = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({
      workItemId: workItemId,
      applicationContext,
    })
    .then(fullWorkItem =>
      new WorkItem(fullWorkItem)
        .assignToUser({
          assigneeId: userToForwardTo.userId,
          assigneeName: userToForwardTo.name,
        })
        .addMessage(
          new Message({
            message,
            sentBy: user.name,
            userId: user.userId,
            sentTo: userToForwardTo.name,
            createdAt: new Date().toISOString(),
          }),
        ),
    );

  return applicationContext.getPersistenceGateway().saveWorkItem({
    workItemToSave: workItemToForward.validate().toRawObject(),
    applicationContext,
  });
};
