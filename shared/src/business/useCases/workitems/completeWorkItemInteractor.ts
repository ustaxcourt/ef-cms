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
  const completedWorkItem = new WorkItem(
    {
      ...originalWorkItem,
      createdAt: createISODateString(),
    },
    {
      applicationContext,
    },
  );

  completedWorkItem
    .setAsCompleted({
      message: completedMessage,
      user,
    })
    .validate()
    .toRawObject();

  const authorizedUser = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: user.userId });

  completedWorkItem.section = authorizedUser.section!;

  await applicationContext.getPersistenceGateway().saveWorkItem({
    applicationContext,
    workItem: completedWorkItem.validate().toRawObject(),
  });

  const caseObject = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: completedWorkItem.docketNumber,
    });

  const caseToUpdate = new Case(caseObject, { applicationContext });

  caseToUpdate.docketEntries.forEach(doc => {
    if (
      doc.workItem &&
      doc.workItem.workItemId === completedWorkItem.workItemId
    ) {
      doc.workItem = completedWorkItem;
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
