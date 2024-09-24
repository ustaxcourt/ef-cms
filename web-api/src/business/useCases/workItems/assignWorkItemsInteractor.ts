import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '../../../../../shared/src/business/entities/User';
import { WorkItem } from '../../../../../shared/src/business/entities/WorkItem';
import { getWorkItemById } from '@web-api/persistence/postgres/workitems/getWorkItemById';
import { saveWorkItem } from '@web-api/persistence/postgres/workitems/saveWorkItem';

/**
 * getWorkItem
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.assigneeId the id of the user to assign the work item to
 * @param {string} providers.assigneeName the name of the user to assign the work item to
 * @param {string} providers.workItemId the id of the work item to assign
 */
export const assignWorkItemsInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    assigneeId,
    assigneeName,
    workItemId,
  }: {
    assigneeId: string;
    assigneeName: string;
    workItemId: string;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ASSIGN_WORK_ITEM)) {
    throw new UnauthorizedError('Unauthorized to assign work item');
  }

  const user = await applicationContext.getPersistenceGateway().getUserById({
    applicationContext,
    userId: authorizedUser.userId,
  });

  const userBeingAssigned = await applicationContext
    .getPersistenceGateway()
    .getUserById({
      applicationContext,
      userId: assigneeId,
    });

  const workItemEntity = await getWorkItemById({
    workItemId,
  });

  if (!workItemEntity) {
    throw new NotFoundError(`WorkItem ${workItemId} was not found.`);
  }

  const userIsCaseServices = User.isCaseServicesUser({ section: user.section });
  const userBeingAssignedIsCaseServices = User.isCaseServicesUser({
    section: userBeingAssigned.section,
  });

  const assignedByCaseServicesUser =
    userIsCaseServices || userBeingAssignedIsCaseServices;

  let sectionToAssignTo = user.section;

  if (assignedByCaseServicesUser) {
    sectionToAssignTo = userBeingAssigned.section;
  }

  workItemEntity.assignToUser({
    assigneeId,
    assigneeName,
    section: sectionToAssignTo,
    sentBy: user.name,
    sentBySection: user.section,
    sentByUserId: user.userId,
  });

  await saveWorkItem({
    workItem: workItemEntity.validate().toRawObject(),
  });
};
