const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

/**
 * getWorkItemInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.workItemId the id of the work item to get
 * @returns {object} the work item data
 */
exports.getWorkItemInteractor = async ({ applicationContext, workItemId }) => {
  const workItem = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({
      applicationContext,
      workItemId,
    });

  if (!workItem) {
    throw new NotFoundError(`WorkItem ${workItemId} was not found.`);
  }

  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.WORKITEM, workItem.assigneeId)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return new WorkItem(workItem, { applicationContext })
    .validate()
    .toRawObject();
};
