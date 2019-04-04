const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const {
  UnprocessableEntityError,
  UnauthorizedError,
} = require('../../../errors/errors');
const { User } = require('../../entities/User');
const { WorkItem } = require('../../entities/WorkItem');

/**
 * updateWorkItem
 *
 * @param workItemId
 * @param workItemToUpdate
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.updateWorkItem = async ({
  workItemToUpdate,
  workItemId,
  applicationContext,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized for update workItem');
  }

  if (!workItemToUpdate || workItemId !== workItemToUpdate.workItemId) {
    throw new UnprocessableEntityError();
  }

  const otherUser = new User(
    await applicationContext
      .getPersistenceGateway()
      .getUserById({ applicationContext, userId: workItemToUpdate.assigneeId }),
  );
  workItemToUpdate.assigneeName = otherUser.name;

  const updatedWorkItem = new WorkItem(workItemToUpdate)
    .validate()
    .toRawObject();

  const afterUpdate = await applicationContext
    .getPersistenceGateway()
    .saveWorkItem({
      applicationContext,
      workItemToSave: updatedWorkItem,
    });

  return new WorkItem(afterUpdate).validate().toRawObject();
};
