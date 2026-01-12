import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';

export const deleteWorkItem = async ({
  workItem,
}: {
  workItem: RawWorkItem;
}): Promise<void> => {
  await pgDeleteFrom({
    table: 'dwWorkItem',
    where: cb => cb.where('workItemId', '=', workItem.workItemId),
  });
};
