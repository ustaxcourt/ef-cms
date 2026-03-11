import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { RawWorkItem, WorkItem } from '@shared/business/entities/WorkItem';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '@shared/business/entities/User';
import { getWorkItemsByIds } from '@web-api/persistence/postgres/workitems/getWorkItemsByIds';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { getDocketEntriesByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';

export const assignWorkItemsInteractor = async (
  _: ServerApplicationContext,
  {
    assigneeId,
    assigneeName,
    workItem,
    workItemIds,
  }: {
    assigneeId: string;
    assigneeName: string;
    workItemIds?: string[];
    workItem?: RawWorkItem;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ASSIGN_WORK_ITEM)) {
    throw new UnauthorizedError('Unauthorized to assign work item');
  }

  const user = await getUserById({
    userId: authorizedUser.userId,
  });

  if (!user) {
    throw new NotFoundError(
      `User not found with user id ${authorizedUser.userId}`,
    );
  }

  const userBeingAssigned = await getUserById({
    userId: assigneeId,
  });

  if (!userBeingAssigned) {
    throw new NotFoundError(`User not found with user id ${assigneeId}`);
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

  let workItemEntities: WorkItem[] = [];

  if (!workItem && workItemIds?.length) {
    const workItems = await getWorkItemsByIds({ workItemIds });

    for (let i = 0; i < workItems.length; i++) {
      if (!workItems[i]) {
        throw new NotFoundError(`WorkItem ${workItemIds[i]} was not found.`);
      }
      workItemEntities.push(workItems[i]!);
    }
  } else if (workItem) {
    workItemEntities = [new WorkItem(workItem)];
  } else {
    throw new NotFoundError(`No work item or work item IDs provided.`);
  }

  const assignedWorkItems = await Promise.all(
    workItemEntities.map(async workItemEntity => {
      const docketEntry = (
        await getDocketEntriesByDocketNumberAndDocketEntryId({
          docketNumbersAndIds: [
            {
              docketNumber: workItemEntity.docketNumber,
              docketEntryId: workItemEntity.docketEntryId,
            },
          ],
        })
      ).at(0);

      if (!docketEntry) {
        throw new NotFoundError(
          `Docket entry associated with work item ${workItemEntity.workItemId} was not found.`,
        );
      }

      workItemEntity.assignToUser({
        assigneeId,
        assigneeName,
        section: WorkItem.getWorkItemSectionFromUserSection({
          section: sectionToAssignTo,
          documentTitle: docketEntry.documentTitle,
        }),
        sentBy: user.name,
        sentBySection: user.section,
        sentByUserId: user.userId,
      });

      return workItemEntity;
    }),
  );

  await upsertWorkItems({
    workItems: assignedWorkItems.map(w => w.validate().toRawObject()),
  });
};
