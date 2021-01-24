const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { cloneDeep } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

/**
 * getWorkItem
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.assigneeId the id of the user to assign the work item to
 * @param {string} providers.assigneeName the name of the user to assign the work item to
 * @param {string} providers.workItemId the id of the work item to assign
 */
exports.assignWorkItemsInteractor = async ({
  applicationContext,
  assigneeId,
  assigneeName,
  workItemId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ASSIGN_WORK_ITEM)) {
    throw new UnauthorizedError('Unauthorized to assign work item');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const fullWorkItem = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({
      applicationContext,
      workItemId,
    });

  const caseObject = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: fullWorkItem.docketNumber,
    });

  const caseToUpdate = new Case(caseObject, { applicationContext });
  const workItemEntity = new WorkItem(fullWorkItem, { applicationContext });
  const originalWorkItem = new WorkItem(cloneDeep(fullWorkItem), {
    applicationContext,
  });

  workItemEntity.assignToUser({
    assigneeId,
    assigneeName,
    section: user.section,
    sentBy: user.name,
    sentBySection: user.section,
    sentByUserId: user.userId,
  });

  // This must run BEFORE saveWorkItemAndAddToUserAndSectionInbox
  await applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
    applicationContext,
    deleteFromSection: false,
    workItem: originalWorkItem.validate().toRawObject(),
  });

  await Promise.all([
    applicationContext.getPersistenceGateway().updateWorkItemInCase({
      applicationContext,
      caseToUpdate: caseToUpdate.validate().toRawObject(),
      workItem: workItemEntity.validate().toRawObject(),
    }),
    applicationContext
      .getPersistenceGateway()
      .saveWorkItemAndAddToUserAndSectionInbox({
        applicationContext,
        workItem: workItemEntity.validate().toRawObject(),
      }),
  ]);
};
