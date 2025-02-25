import { WorkItem } from '@shared/business/entities/WorkItem';
import { getDbReader } from '@web-api/database';
import { workItemEntity } from '@web-api/persistence/postgres/workitems/mapper';

export const getWorkItemById = async ({
  workItemId,
}: {
  workItemId: string;
}): Promise<WorkItem | undefined> => {
  const workItem = await getDbReader(reader =>
    reader
      .selectFrom('dwWorkItem as w')
      .leftJoin('dwCase as c', 'c.docketNumber', 'w.docketNumber')
      .where('w.workItemId', '=', workItemId)
      .selectAll()
      .select('w.docketNumber')
      .executeTakeFirst(),
  );

  if (!workItem) return undefined;

  return workItemEntity(workItem);
};
