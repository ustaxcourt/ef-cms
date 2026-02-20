import { getDbReader } from '@web-api/database';
import { fromKyselyWorkItemAndCase } from '@web-api/persistence/postgres/workitems/mapper';
import { Database } from '@web-api/database-schema';
import { Kysely } from 'kysely';
import {
  RawWorkItemWithCaseAndDocketEntryInfo,
  WorkItemWithCaseInfoKysely,
} from '@web-api/persistence/postgres/workitems/schema';
import { getDocketEntriesByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
import { DocketEntrySelectableField } from '@web-api/persistence/postgres/docketEntries/commonQueries';

const DOCKET_ENTRY_FIELDS_FOR_WORK_ITEM_QC: DocketEntrySelectableField[] = [
  'docketEntryId',
  'docketNumber',
  'eventCode',
  'documentType',
  'documentTitle',
  'additionalInfo',
  'receivedAt',
  'createdAt',
  'filedBy',
  'multiDocketedOn',
  // Fields needed for DocketEntry.isServed() check
  'servedAt',
  'isLegacyServed',
  // Fields needed for formatDocketEntry and getWorkItemDocumentLink
  'isPaper',
  'lodged',
  'isLegacySealed',
  'signedAt',
  'certificateOfServiceDate',
  // Additional fields accessed by tests/UI
  'userId',
  'otherFilingParty',
];

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
      'c.docketNumberSuffix',
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
  // Only fetch the fields needed for QC work item display.
  const docketEntries = await getDocketEntriesByDocketNumberAndDocketEntryId({
    docketNumbersAndIds,
    selectFields: DOCKET_ENTRY_FIELDS_FOR_WORK_ITEM_QC,
  });

  const entryByCompositeKey = new Map<string, RawDocketEntry>(); // We need to join on both docketEntryId and docketNumber
  for (const entry of docketEntries) {
    const key = `${entry.docketNumber}|${entry.docketEntryId}`;
    entryByCompositeKey.set(key, entry);
  }

  const consolidatedCaseData = await getConsolidatedCaseData({ workItems });

  const workItemsWithDocketEntries = workItems.map(w => {
    const key = `${w.docketNumber}|${w.docketEntryId}`;
    const docketEntry = entryByCompositeKey.get(key);

    const consolidatedInfo = w.leadDocketNumber
      ? consolidatedCaseData.get(w.leadDocketNumber)
      : undefined;

    return {
      ...fromKyselyWorkItemAndCase(w),
      docketEntry: docketEntry ?? ({} as RawDocketEntry),
      consolidatedCases: consolidatedInfo,
    };
  });

  return workItemsWithDocketEntries;
};

const getConsolidatedCaseData = async ({
  workItems,
}: {
  workItems: WorkItemWithCaseInfoKysely[];
}) => {
  const leadDocketNumbers = Array.from(
    new Set(
      workItems.filter(w => w.leadDocketNumber).map(w => w.leadDocketNumber!),
    ),
  );

  if (leadDocketNumbers.length === 0) {
    return new Map();
  }

  const consolidatedCases = await getDbReader(reader => {
    return reader
      .selectFrom('dwCase as c')
      .select(['c.docketNumber', 'c.docketNumberSuffix', 'c.leadDocketNumber'])
      .where('c.leadDocketNumber', 'in', leadDocketNumbers)
      .execute();
  });

  const consolidatedByLead = new Map<
    string,
    Array<{
      docketNumber: string;
      docketNumberWithSuffix?: string;
      inLeadCase: boolean;
    }>
  >();

  for (const leadDocketNumber of leadDocketNumbers) {
    const casesInGroup = consolidatedCases.filter(
      c =>
        c.leadDocketNumber === leadDocketNumber ||
        c.docketNumber === leadDocketNumber,
    );

    const groupedCases = casesInGroup.map(c => ({
      docketNumber: c.docketNumber,
      docketNumberWithSuffix: c.docketNumberSuffix
        ? `${c.docketNumber}${c.docketNumberSuffix}`
        : undefined,
      inLeadCase: c.docketNumber === leadDocketNumber,
    }));

    consolidatedByLead.set(leadDocketNumber, groupedCases);
  }

  return consolidatedByLead;
};
