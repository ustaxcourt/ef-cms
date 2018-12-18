const WorkItem = require('../../entities/WorkItem');
const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const {
  UnprocessableEntityError,
  UnauthorizedError,
} = require('../../../errors/errors');

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
  userId,
  workItemToUpdate,
  workItemId,
  applicationContext,
}) => {
  if (!isAuthorized(userId, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized for update workItem');
  }

  if (!workItemToUpdate || workItemId !== workItemToUpdate.workItemId) {
    throw new UnprocessableEntityError();
  }

  const updatedWorkItem = new WorkItem(workItemToUpdate).validate().toJSON();

  const caseAfterUpdate = await applicationContext
    .getPersistenceGateway()
    .saveWorkItem({
      workItemToSave: updatedWorkItem,
      applicationContext,
    });

  return new WorkItem(caseAfterUpdate).validate().toJSON();
};
