import { getDbReader } from '@web-api/database';
import { fromKyselyWorkItemAndCase } from '@web-api/persistence/postgres/workitems/mapper';
import { Database } from '@web-api/database-schema';
import { Kysely } from 'kysely';
import {
  RawWorkItemWithCaseAndDocketEntryInfo,
  WorkItemWithCaseInfoKysely,
} from '@web-api/persistence/postgres/workitems/schema';
import { getDocketEntriesByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';

export const getDocumentQCInboxForUser = async ({
  userId,
}: {
  userId: string;
}): Promise<RawWorkItemWithCaseAndDocketEntryInfo[]> => {
  const workItems: WorkItemWithCaseInfoKysely[] = await getDbReader(reader => {
    return workItemQCQueryBase(reader)
      .where('w.assigneeId', '=', userId)
      .where('w.completedAt', 'is', null)
      .limit(5000)
      .execute();
  });
  return await attachDocketEntriesToWorkItemQC({ workItems });
};

export const workItemQCQueryBase = (dbReader: Kysely<Database>) => {
  return dbReader
    .selectFrom('dwWorkItem as w')
    .leftJoin('dwCase as c', 'c.docketNumber', 'w.docketNumber')
    .selectAll('w')
    .select([
      'c.status',
      'c.caption',
      'c.leadDocketNumber',
      'c.trialDate',
      'c.trialLocation',
    ]);
};

export const attachDocketEntriesToWorkItemQC = async ({
  workItems,
}: {
  workItems: WorkItemWithCaseInfoKysely[];
}) => {
  if (workItems.length === 0) {
    return [];
  }

  const docketEntryInfo = workItems.map(w => ({
    docketEntryId: w.docketEntryId,
    docketNumber: w.docketNumber,
  }));
  const docketEntries = await getDocketEntriesByDocketNumberAndDocketEntryId({
    docketNumbersAndIds: docketEntryInfo,
  });

  const entryById = new Map<string, RawDocketEntry>();
  for (const docketEntry of docketEntries) {
    entryById.set(docketEntry.docketEntryId, docketEntry);
  }

  const workItemsWithDocketEntries = workItems.map(w => {
    const docketEntry = entryById.get(w.docketEntryId);
    return {
      ...fromKyselyWorkItemAndCase(w),
      docketEntry: docketEntry ?? ({} as RawDocketEntry),
    };
  });

  return workItemsWithDocketEntries;
};
