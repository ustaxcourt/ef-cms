import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { put } from '../../dynamodbClientService';
import { putWorkItemInUsersOutbox } from './putWorkItemInUsersOutbox';

export const saveWorkItem = async ({
  applicationContext,
  workItem,
}: {
  applicationContext: IApplicationContext;
  workItem: RawWorkItem;
}): Promise<void> => {
  let gsiUserBox;
  let gsiSectionBox;

  if (workItem.completedAt) {
    await putWorkItemInUsersOutbox({
      applicationContext,
      section: workItem.section,
      userId: workItem.completedByUserId,
      workItem,
    });
  } else {
    const box =
      workItem.inProgress || workItem.caseIsInProgress ? 'inProgress' : 'inbox';
    gsiUserBox = workItem.assigneeId
      ? `assigneeId|${box}|${workItem.assigneeId}`
      : undefined;
    gsiSectionBox = workItem.section
      ? `section|${box}|${workItem.section}`
      : undefined;
  }

  await put({
    Item: {
      gsi1pk: `work-item|${workItem.workItemId}`,
      gsiSectionBox,
      gsiUserBox,
      pk: `case|${workItem.docketNumber}`,
      sk: `work-item|${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });
};
