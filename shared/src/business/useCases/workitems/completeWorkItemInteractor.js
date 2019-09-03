const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { createISODateString } = require('../../utilities/DateHandler');

const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

/**
 * completeWorkItemInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.completedMessage the message for completing the work item
 * @param {string} providers.workItemId the id of the work item to complete
 * @returns {object} the completed work item
 */
exports.completeWorkItemInteractor = async ({
  applicationContext,
  completedMessage,
  workItemId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized for complete workItem');
  }

  const originalWorkItem = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({
      applicationContext,
      workItemId,
    });

  const completedWorkItem = new WorkItem(originalWorkItem, {
    applicationContext,
  })
    .setAsCompleted({
      message: completedMessage,
      user: applicationContext.getCurrentUser(),
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

  await applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
    applicationContext,
    workItem: completedWorkItem,
  });

  await applicationContext.getPersistenceGateway().updateWorkItem({
    applicationContext,
    workItemToUpdate: completedWorkItem,
  });

  const caseObject = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId: completedWorkItem.caseId,
    });

  const caseToUpdate = new Case(caseObject, { applicationContext });

  const workItemEntity = new WorkItem(completedWorkItem, {
    applicationContext,
  });

  caseToUpdate.documents.forEach(
    document =>
      (document.workItems = document.workItems.map(item => {
        return item.workItemId === workItemEntity.workItemId
          ? workItemEntity
          : item;
      })),
  );

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseToUpdate.validate().toRawObject(),
  });

  return completedWorkItem;
};
