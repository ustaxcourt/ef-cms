import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '../utils/transformNullToUndefined';
import { WorkItem } from '@shared/business/entities/WorkItem';

export const getWorkItemsByDocketNumber = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<WorkItem[]> => {
  const workItems = await getDbReader(reader => {
    return reader
      .selectFrom('workItem')
      .where('docketNumber', '=', docketNumber)
      .selectAll()
      .execute();
  });

  return workItems.map(
    workItem => new WorkItem(transformNullToUndefined({ ...workItem })),
  );
};
