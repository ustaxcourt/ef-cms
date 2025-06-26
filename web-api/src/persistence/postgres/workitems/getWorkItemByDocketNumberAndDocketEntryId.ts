import { WorkItem } from '@shared/business/entities/WorkItem';
import { getWorkItemsByDocketNumber } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';

// TODO: This can be improved if we don't store docketEntry on workItem rows :/
export async function getWorkItemByDocketNumberAndDocketEntryId({
  docketNumber,
  docketEntryId,
}: {
  docketNumber: string;
  docketEntryId: string;
}): Promise<WorkItem | undefined> {
  const workItemsOnCase = await getWorkItemsByDocketNumber({ docketNumber });
  const workItem = workItemsOnCase.find(
    w => w.docketEntry.docketEntryId === docketEntryId,
  );
  return workItem;
}
