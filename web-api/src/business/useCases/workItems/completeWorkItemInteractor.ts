import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { WorkItem } from '../../../../../shared/src/business/entities/WorkItem';
import { createISODateString } from '../../../../../shared/src/business/utilities/DateHandler';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';

/**
 * completeWorkItemInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.completedMessage the message for completing the work item
 * @param {string} providers.workItemId the id of the work item to complete
 * @returns {object} the completed work item
 */
export const completeWorkItem = async (
  applicationContext: ServerApplicationContext,
  {
    completedMessage,
    workItemId,
  }: {
    completedMessage: string;
    workItemId: string;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError('Unauthorized for complete workItem');
  }

  const originalWorkItem = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({
      applicationContext,
      workItemId,
    });
  const originalWorkItemEntity = new WorkItem(originalWorkItem);

  const completedWorkItem = originalWorkItemEntity
    .setAsCompleted({
      message: completedMessage,
      user: authorizedUser,
    })
    .validate()
    .toRawObject();

  await applicationContext.getPersistenceGateway().putWorkItemInOutbox({
    applicationContext,
    authorizedUser,
    workItem: {
      ...completedWorkItem,
      createdAt: createISODateString(),
    },
  });

  await applicationContext.getPersistenceGateway().saveWorkItem({
    applicationContext,
    workItem: completedWorkItem,
  });

  const caseObject = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: completedWorkItem.docketNumber,
    });

  const caseToUpdate = new Case(caseObject, { authorizedUser });

  const workItemEntity = new WorkItem(completedWorkItem);

  caseToUpdate.docketEntries.forEach(doc => {
    if (doc.workItem && doc.workItem.workItemId === workItemEntity.workItemId) {
      doc.workItem = workItemEntity;
    }
  });

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    authorizedUser,
    caseToUpdate,
  });

  return completedWorkItem;
};

export const determineEntitiesToLock = async (
  applicationContext: ServerApplicationContext,
  { workItemId }: { workItemId: string },
) => {
  const originalWorkItem = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({
      applicationContext,
      workItemId,
    });

  return {
    identifiers: [`case|${originalWorkItem!.docketNumber}`],
  };
};

export const completeWorkItemInteractor = withLocking(
  completeWorkItem,
  determineEntitiesToLock,
);
