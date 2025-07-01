import { getDbReader } from '@web-api/database';
import { WorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { toWorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/mapper';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

export const getDocumentQCServedForUser = async ({
  afterDate,
  userId,
}: {
  userId: string;
  afterDate: Date;
}): Promise<WorkItemWithCaseInfo[]> => {
  const workItems = await getDbReader(reader => {
    return reader
      .selectFrom('dwWorkItem as w')
      .leftJoin('dwCase as c', 'c.docketNumber', 'w.docketNumber')
      .innerJoin('dwDocketEntry as d', join =>
        join
          .onRef('d.docketEntryId', '=', 'w.docketEntryId')
          .onRef('d.docketNumber', '=', 'w.docketNumber'),
      )
      .where('w.assigneeId', '=', userId)
      .where('w.completedAt', '>=', afterDate)
      .select(eb => [
        jsonObjectFrom(
          eb
            .selectFrom('dwDocketEntry as docketEntry')
            .selectAll()
            .whereRef('d.docketEntryId', '=', 'w.docketEntryId')
            .limit(1),
        )
          .$notNull()
          .as('docketEntry'),
        'c.status',
        'c.caption',
        'c.leadDocketNumber',
        'c.trialDate',
        'c.trialLocation',
      ])
      .selectAll('w')
      .execute();
  });

  return workItems.map(toWorkItemWithCaseInfo);
};
