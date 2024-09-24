import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '../utils/transformNullToUndefined';
import { WorkItem } from '@shared/business/entities/WorkItem';

export const getWorkItemById = async ({
  workItemId,
}: {
  workItemId: string;
}): Promise<WorkItem | undefined> => {
  const workItem = await getDbReader(reader =>
    reader
      .selectFrom('workItem')
      .where('workItemId', '=', workItemId)
      .selectAll()
      .executeTakeFirst(),
  );

  if (!workItem) return undefined;

  return new WorkItem(transformNullToUndefined({ ...workItem }));
};
