import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { getDbReader } from '@web-api/database';
import { Database } from '@web-api/database-schema';
import { toWorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/mapper';
import { Kysely } from 'kysely';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

export const getDocumentQCInboxForUser = async ({
  userId,
}: {
  userId: string;
}): Promise<WorkItemWithCaseInfo[]> => {
  const workItems = await getDbReader(reader => {
    return workItemQCQueryBase(reader)
      .where('w.assigneeId', '=', userId)
      .where('w.completedAt', 'is', null)
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

export const workItemQCQueryBase = (dbReader: Kysely<Database>) => {
  return dbReader
    .selectFrom('dwWorkItem as w')
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
          .selectFrom('dwDocketEntry as de')
          .selectAll()
          .whereRef('de.docketEntryId', '=', 'w.docketEntryId')
          .whereRef('de.docketNumber', '=', 'w.docketNumber'),
      ).as('docketEntry'),
      'c.status',
      'c.caption',
      'c.leadDocketNumber',
      'c.trialDate',
      'c.trialLocation',
    ]);
};
