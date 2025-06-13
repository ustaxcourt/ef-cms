import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { RawWorkItem, WorkItem } from '@shared/business/entities/WorkItem';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '@shared/business/entities/User';
import { getWorkItemById } from '@web-api/persistence/postgres/workitems/getWorkItemById';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

export const assignWorkItemsInteractor = async (
  {
    assigneeId,
    assigneeName,
    workItem,
    workItemId,
  }: {
    assigneeId: string;
    assigneeName: string;
    workItemId?: string;
    workItem?: RawWorkItem;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ASSIGN_WORK_ITEM)) {
    throw new UnauthorizedError('Unauthorized to assign work item');
  }

  const [user, userBeingAssigned] = await Promise.all([
    getUserById({
      userId: authorizedUser.userId,
    }),
    getUserById({
      userId: assigneeId,
    }),
  ]);
  if (!user) {
    throw new NotFoundError(
      `Unable to find user with userId ${authorizedUser.userId}`,
    );
  }
  if (!userBeingAssigned) {
    throw new NotFoundError(`Unable to find user with userId ${assigneeId}`);
  }

  let workItemEntity;
  if (!workItem && workItemId) {
    workItemEntity = await getWorkItemById({
      workItemId,
    });
    if (!workItemEntity) {
      throw new NotFoundError(`WorkItem ${workItemId} was not found.`);
    }
  } else {
    workItemEntity = new WorkItem(workItem);
  }

  const userIsCaseServices = User.isCaseServicesUser({
    section: user.section!,
  });
  const userBeingAssignedIsCaseServices = User.isCaseServicesUser({
    section: userBeingAssigned.section!,
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

  await upsertWorkItems({
    workItems: [workItemEntity.validate().toRawObject()],
  });
};
