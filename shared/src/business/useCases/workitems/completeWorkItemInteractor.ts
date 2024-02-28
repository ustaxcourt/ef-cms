import { Case } from '../../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { RawWorkItem, WorkItem } from '../../entities/WorkItem';
import { UnauthorizedError } from '@web-api/errors/errors';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

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
  applicationContext: IApplicationContext,
  {
    completedMessage,
    workItemId,
  }: {
    completedMessage: string;
    workItemId: string;
  },
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

  const authorizedUser = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: user.userId });

  await applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox({
    applicationContext,
    section: authorizedUser.section,
    userId: user.userId,
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

export const determineEntitiesToLock = async (
  applicationContext: IApplicationContext,
  { workItemId }: { workItemId: string },
) => {
  const originalWorkItem = (await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({
      applicationContext,
      workItemId,
    })) as unknown as RawWorkItem;

  return {
    identifiers: [`case|${originalWorkItem.docketNumber}`],
  };
};

export const completeWorkItemInteractor = withLocking(
  completeWorkItem,
  determineEntitiesToLock,
);
