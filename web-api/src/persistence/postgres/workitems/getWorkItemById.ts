import { WorkItem } from '@shared/business/entities/WorkItem';
import { getWorkItemsByIds } from '@web-api/persistence/postgres/workitems/getWorkItemsByIds';

export const getWorkItemById = async ({
  workItemId,
}: {
  workItemId: string;
}): Promise<WorkItem | undefined> => {
  const [workItem] = await getWorkItemsByIds({
    workItemIds: [workItemId],
  });
  return workItem;
};
