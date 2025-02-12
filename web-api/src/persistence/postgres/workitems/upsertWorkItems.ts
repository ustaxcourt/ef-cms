import { RawWorkItem, WorkItem } from '@shared/business/entities/WorkItem';
import { toKyselyNewWorkItem } from './mapper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertWorkItems = async ({
  workItems,
}: {
  workItems: RawWorkItem[];
}): Promise<RawWorkItem[]> => {
  const createdWorkItems = await pgInsertInto({
    table: 'dwWorkItem',
    values: workItems.map(w => toKyselyNewWorkItem(w)),
    onConflictColumns: ['workItemId'],
  });

  if (!createdWorkItems) {
    throw new Error('could not upsert work items');
  }

  return createdWorkItems.map(w => new WorkItem(w));
};
