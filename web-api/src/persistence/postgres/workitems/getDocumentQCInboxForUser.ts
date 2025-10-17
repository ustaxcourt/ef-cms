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

  const docketNumbersAndIds = workItems.map(w => ({
    docketNumber: w.docketNumber,
    docketEntryId: w.docketEntryId,
  }));

  // We could get docket entries in workItemQCQueryBase, but it made getting good types extremely tricky, and the query is more difficult.
  // Instead, we make a separate query for docket entries and do an in-app join.
  const docketEntries = await getDocketEntriesByDocketNumberAndDocketEntryId({
    docketNumbersAndIds,
  });

  const entryByCompositeKey = new Map<string, RawDocketEntry>(); // We need to join on both docketEntryId and docketNumber
  for (const entry of docketEntries) {
    const key = `${entry.docketNumber}|${entry.docketEntryId}`;
    entryByCompositeKey.set(key, entry);
  }

  const workItemsWithDocketEntries = workItems.map(w => {
    const key = `${w.docketNumber}|${w.docketEntryId}`;
    const docketEntry = entryByCompositeKey.get(key);
    return {
      ...fromKyselyWorkItemAndCase(w),
      docketEntry: docketEntry ?? ({} as RawDocketEntry),
    };
  });

  return workItemsWithDocketEntries;
};
