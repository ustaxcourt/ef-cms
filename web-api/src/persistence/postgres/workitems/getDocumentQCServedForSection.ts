import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '../utils/transformNullToUndefined';
import { WorkItem } from '@shared/business/entities/WorkItem';

export const getDocumentQCServedForSection = async ({
  section,
  afterDate,
}: {
  section: string;
  afterDate: string;
}): Promise<WorkItem[]> => {
  const workItems = await getDbReader(reader => {
    return reader
      .selectFrom('workItem')
      .where('section', '=', section)
      .where('createdAt', '>=', afterDate)
      .selectAll()
      .execute();
  });

  return workItems.map(
    workItem => new WorkItem(transformNullToUndefined({ ...workItem })),
  );
};
