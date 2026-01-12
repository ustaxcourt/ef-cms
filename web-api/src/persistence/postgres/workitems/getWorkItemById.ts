import { WorkItem } from '@shared/business/entities/WorkItem';
import { getDbReader } from '@web-api/database';
import { fromKyselyWorkItem } from '@web-api/persistence/postgres/workitems/mapper';

export const getWorkItemById = async ({
  workItemId,
}: {
  workItemId: string;
}): Promise<WorkItem | undefined> => {
  const workItem = await getDbReader(reader =>
    reader
      .selectFrom('dwWorkItem')
      .where('workItemId', '=', workItemId)
      .selectAll()
      .executeTakeFirst(),
  );

  if (!workItem) return undefined;

  return fromKyselyWorkItem(workItem);
};
