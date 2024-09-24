import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '../utils/transformNullToUndefined';
import { WorkItem } from '@shared/business/entities/WorkItem';

export const getDocumentQCServedForUser = async ({
  userId,
  afterDate,
}: {
  userId: string;
  afterDate: string;
}): Promise<WorkItem[]> => {
  const workItems = await getDbReader(reader => {
    return reader
      .selectFrom('workItem')
      .where('assigneeId', '=', userId)
      .where('createdAt', '>', afterDate)
      .selectAll()
      .execute();
  });

  return workItems.map(
    workItem => new WorkItem(transformNullToUndefined({ ...workItem })),
  );
};
