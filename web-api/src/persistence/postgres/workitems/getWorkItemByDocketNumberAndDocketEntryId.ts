import { WorkItem } from '@shared/business/entities/WorkItem';
import { getDbReader } from '@web-api/database';
import { workItemEntity } from '@web-api/persistence/postgres/workitems/mapper';

export async function getWorkItemByDocketNumberAndDocketEntryId({
  docketNumber,
  docketEntryId,
}: {
  docketNumber: string;
  docketEntryId: string;
}): Promise<WorkItem | undefined> {
  const result = await getDbReader(reader =>
    reader
      .selectFrom('dwWorkItem')
      .where('docketNumber', '=', docketNumber)
      .where('docketEntryId', '=', docketEntryId)
      .select([
        'assigneeId',
        'assigneeName',
        'completedAt',
        'completedBy',
        'completedByUserId',
        'createdAt',
        'docketEntryId',
        'docketNumber',
        'inProgress',
        'isRead',
        'section',
        'sentBy',
        'sentBySection',
        'sentByUserId',
        'updatedAt',
        'workItemId',
      ])
      .executeTakeFirst(),
  );

  if (!result) {
    return undefined;
  }

  return workItemEntity(result);
}
