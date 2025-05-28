import { WorkItem } from '@shared/business/entities/WorkItem';
import { getWorkItemsByDocketNumber } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';

// We should just store docketEntryId on the work item table. We don't.
// Until then, we have to pass in the docketNumber and then loop through the work items associated with it.
export const getWorkItemByDocketEntryId = async ({
  docketNumber,
  docketEntryId,
}: {
  docketNumber: string;
  docketEntryId: string;
}): Promise<WorkItem | null> => {
  const workItemsOnCase = await getWorkItemsByDocketNumber({
    docketNumber,
  });
  for (const workItem of workItemsOnCase) {
    if (workItem.docketEntry.docketEntryId === docketEntryId) {
      return workItem;
    }
  }
  return null;
};
