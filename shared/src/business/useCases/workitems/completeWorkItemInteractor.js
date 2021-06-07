const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { createISODateString } = require('../../utilities/DateHandler');
const { UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

/**
 * completeWorkItemInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.completedMessage the message for completing the work item
 * @param {string} providers.workItemId the id of the work item to complete
 * @returns {object} the completed work item
 */
exports.completeWorkItemInteractor = async (
  applicationContext,
  { completedMessage, workItemId },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError('Unauthorized for complete workItem');
  }

  const originalWorkItem = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({
      applicationContext,
      workItemId,
    });
  const originalWorkItemEntity = new WorkItem(originalWorkItem, {
    applicationContext,
  });

  const completedWorkItem = originalWorkItemEntity
    .setAsCompleted({
      message: completedMessage,
      user,
    })
    .validate()
    .toRawObject();

  await applicationContext.getPersistenceGateway().putWorkItemInOutbox({
    applicationContext,
    workItem: {
      ...completedWorkItem,
      createdAt: createISODateString(),
    },
  });

  await applicationContext.getPersistenceGateway().updateWorkItem({
    applicationContext,
    workItemToUpdate: completedWorkItem,
  });

  const caseObject = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: completedWorkItem.docketNumber,
    });

  const caseToUpdate = new Case(caseObject, { applicationContext });

  const workItemEntity = new WorkItem(completedWorkItem, {
    applicationContext,
  });

  caseToUpdate.docketEntries.forEach(doc => {
    if (doc.workItem && doc.workItem.workItemId === workItemEntity.workItemId) {
      doc.workItem = workItemEntity;
    }
  });

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate,
  });

  return completedWorkItem;
};
