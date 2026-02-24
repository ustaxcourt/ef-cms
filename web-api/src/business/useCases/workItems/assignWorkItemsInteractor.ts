import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { RawWorkItem, WorkItem } from '@shared/business/entities/WorkItem';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '@shared/business/entities/User';
import { getWorkItemById } from '@web-api/persistence/postgres/workitems/getWorkItemById';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { getDocketEntriesByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
import { getWorkItemsByDocketNumber } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';

export const assignWorkItemsInteractor = async (
  _: ServerApplicationContext,
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

  let workItemEntity: WorkItem | undefined;
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
      `Docket entry associated with work item ${workItemId} was not found.`,
    );
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
    section: WorkItem.getWorkItemSectionFromUserSection({
      section: sectionToAssignTo,
      documentTitle: docketEntry.documentTitle,
    }),
    sentBy: user.name,
    sentBySection: user.section,
    sentByUserId: user.userId,
  });

  let workItemsToAssign = [workItemEntity.validate().toRawObject()];
  if (
    workItemEntity.leadDocketNumber &&
    workItemEntity.leadDocketNumber === workItemEntity.docketNumber
  ) {
    const memberWorkItems = await getWorkItemsByDocketNumber({
      docketNumber: workItemEntity.leadDocketNumber,
    });
    const memberWorkItemsToAssign = memberWorkItems
      .filter(
        wi =>
          wi.docketEntryId === workItemEntity.docketEntryId &&
          wi.docketNumber !== workItemEntity.docketNumber,
      )
      .map(wi => {
        wi.assignToUser({
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
        return wi.validate().toRawObject();
      });
    workItemsToAssign = workItemsToAssign.concat(memberWorkItemsToAssign);
  }

  await upsertWorkItems({
    workItems: workItemsToAssign,
  });
};
