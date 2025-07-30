import { WorkItem } from '@shared/business/entities/WorkItem';
import { fromKyselyWorkItem } from '@web-api/persistence/postgres/workitems/mapper';
import { getDbReader } from '@web-api/persistence/postgres/database';

export const getWorkItemsByDocketNumber = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<WorkItem[]> => {
  const workItems = await getDbReader(reader => {
    return reader
      .selectFrom('dwWorkItem')
      .where('docketNumber', '=', docketNumber)
      .selectAll()
      .execute();
  });

  return workItems.map(workItem => fromKyselyWorkItem(workItem));
};
