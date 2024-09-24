import { RawWorkItem, WorkItem } from '@shared/business/entities/WorkItem';
import { getDbWriter } from '@web-api/database';
import { toKyselyNewWorkItem } from './mapper';

export const saveWorkItem = async ({
  workItem,
}: {
  workItem: RawWorkItem;
}): Promise<RawWorkItem> => {
  const createdWorkItem = await getDbWriter(writer =>
    writer
      .insertInto('workItem')
      .values(toKyselyNewWorkItem(workItem))
      .returningAll()
      .executeTakeFirst(),
  );

  if (!workItem) {
    throw new Error('could not create a work item');
  }

  return new WorkItem(createdWorkItem);
};
