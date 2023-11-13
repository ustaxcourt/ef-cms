import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { User } from '../../entities/User';
import { WorkItem } from '../../entities/WorkItem';

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
  applicationContext: IApplicationContext,
  {
    assigneeId,
    assigneeName,
    workItemId,
  }: {
    assigneeId: string;
    assigneeName: string;
    workItemId: string;
  },
) => {
  const authorizedUser = applicationContext.getCurrentUser();
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

  const workItemRecord = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({
      applicationContext,
      workItemId,
    });

  const workItemEntity = new WorkItem(workItemRecord, {
    applicationContext,
  });
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

  await applicationContext.getPersistenceGateway().saveWorkItem({
    applicationContext,
    workItem: workItemEntity.validate().toRawObject(),
  });
};
