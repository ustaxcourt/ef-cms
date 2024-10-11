import { WorkItem } from '@shared/business/entities/WorkItem';
import { getDbReader } from '@web-api/database';
import { workItemEntity } from '@web-api/persistence/postgres/workitems/mapper';

export const getDocumentQCServedForSection = async ({
  afterDate,
  sections,
}: {
  sections: string[];
  afterDate: Date;
}): Promise<WorkItem[]> => {
  const workItems = await getDbReader(reader => {
    return reader
      .selectFrom('dwWorkItem as w')
      .leftJoin('dwCase as c', 'c.docketNumber', 'w.docketNumber')
      .where('w.section', 'in', sections)
      .where('w.completedAt', '>=', afterDate)
      .selectAll()
      .select('w.docketNumber')
      .execute();
  });

  return workItems.map(workItem => workItemEntity(workItem));
};
