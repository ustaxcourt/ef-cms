import { WorkItem } from '@shared/business/entities/WorkItem';
import { getDbReader } from '@web-api/database';
import { workItemEntity } from '@web-api/persistence/postgres/workitems/mapper';

export const getDocumentQCServedForSection = async ({
  afterDate,
  section,
}: {
  section: string;
  afterDate: Date;
}): Promise<WorkItem[]> => {
  const workItems = await getDbReader(reader => {
    return reader
      .selectFrom('workItem as w')
      .leftJoin('case as c', 'c.docketNumber', 'w.docketNumber')
      .where('w.section', '=', section)
      .where('w.createdAt', '>=', afterDate)
      .selectAll()
      .select('w.docketNumber')
      .execute();
  });

  return workItems.map(workItem => workItemEntity(workItem));
};
