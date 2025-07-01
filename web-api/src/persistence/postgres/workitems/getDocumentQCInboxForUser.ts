import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { getDbReader } from '@web-api/database';
import { toWorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/mapper';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

export const getDocumentQCInboxForUser = async ({
  userId,
}: {
  userId: string;
}): Promise<WorkItemWithCaseInfo[]> => {
  const workItems = await getDbReader(reader => {
    return reader
      .selectFrom('dwWorkItem as w')
      .where('w.assigneeId', '=', userId)
      .where('w.completedAt', 'is', null)
      .leftJoin('dwCase as c', 'c.docketNumber', 'w.docketNumber')
      .innerJoin('dwDocketEntry as d', join =>
        join
          .onRef('d.docketEntryId', '=', 'w.docketEntryId')
          .onRef('d.docketNumber', '=', 'w.docketNumber'),
      )
      .selectAll('w')
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
      .limit(5000)
      .execute();
  });

  return workItems.map(toWorkItemWithCaseInfo);
};

export type WorkItemWithCaseInfo = Omit<RawWorkItem, 'docketEntry'> & {
  caseTitle?: string;
  caseStatus?: string;
  leadDocketNumber?: string;
  trialDate?: string;
  trialLocation?: string;
  docketEntry: RawDocketEntry;
};
