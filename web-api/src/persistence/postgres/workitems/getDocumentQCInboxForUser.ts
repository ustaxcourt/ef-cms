import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { getDbReader } from '@web-api/database';
import { fromKyselyWorkItemAndCase } from '@web-api/persistence/postgres/workitems/mapper';
import { Database } from '@web-api/database-schema';
import { Kysely, SelectQueryBuilder } from 'kysely';
import { DocketEntryKysely } from '@web-api/persistence/postgres/docketEntries/schema';
import { SelectFrom } from 'kysely/dist/cjs/parser/select-from-parser';

type whereCallback<T extends keyof Database> = (
  qb: SelectFrom<Database, T, T>,
) => SelectQueryBuilder<Database, T, T>;

export const getDocumentQCInboxForUser = async ({
  userId,
}: {
  userId: string;
}): Promise<WorkItemWithCaseInfo[]> => {
  return await getDocumentQcWorkitems({
    where: (cb: any) =>
      cb.where('w.assigneeId', '=', userId).where('w.completedAt', 'is', null),
  });
};

export type WorkItemWithCaseInfo = RawWorkItem & {
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
    .select([
      'c.status',
      'c.caption',
      'c.leadDocketNumber',
      'c.trialDate',
      'c.trialLocation',
    ]);
};

export const getDocumentQcWorkitems = async ({
  where,
}: {
  where: whereCallback<'dwWorkItem'>;
}) => {
  const workItems = await getDbReader(reader => {
    return where(workItemQCQueryBase(reader).limit(5000)).execute();
  });

  const docketEntryIds = workItems.map(w => w.docketEntryId);
  const docketEntries = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry')
      .selectAll()
      .where('docketEntryId', 'in', docketEntryIds)
      .execute(),
  );

  const workItemsWithDocketEntries = workItems.map(w => ({
    ...w,
    docketEntry: {} as DocketEntryKysely,
  }));

  for (const docketEntry of docketEntries) {
    for (const workItem of workItemsWithDocketEntries) {
      if (docketEntry.docketEntryId === workItem.docketEntryId) {
        workItem.docketEntry = docketEntry;
      }
    }
  }
  return workItemsWithDocketEntries.map(fromKyselyWorkItemAndCase);
};
