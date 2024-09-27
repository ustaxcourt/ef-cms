import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { getDbWriter } from '@web-api/database';

export const deleteWorkItem = async ({
  workItem,
}: {
  workItem: RawWorkItem;
}): Promise<void> => {
  await getDbWriter(writer =>
    writer
      .deleteFrom('workItem')
      .where('workItemId', '=', workItem.workItemId)
      .execute(),
  );
};
