import { WorkItem } from '@shared/business/entities/WorkItem';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { fromKyselyWorkItem } from '@web-api/persistence/postgres/workitems/mapper';

export const getWorkItemsByIds = async ({
  workItemIds,
}: {
  workItemIds: string[];
}): Promise<WorkItem[]> => {
  const workItems = await getDbReader(reader =>
    reader
      .selectFrom('dwWorkItem')
      .where('workItemId', 'in', workItemIds)
      .selectAll()
      .execute(),
  );

  return workItems.map(workItem => fromKyselyWorkItem(workItem));
};
