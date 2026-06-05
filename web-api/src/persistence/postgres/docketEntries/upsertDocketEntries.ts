import { toKyselyNewDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';
import { DocketEntryTable } from '@web-api/persistence/postgres/docketEntries/schema';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { withValidation } from '@web-api/persistence/postgres/utils/withValidation';

const upsertDocketEntriesWithoutValidation = async (
  docketEntries: RawDocketEntry[],
  {
    excludeFromUpdateColumns = [],
  }: { excludeFromUpdateColumns?: (keyof DocketEntryTable)[] } = {},
) => {
  if (docketEntries.length === 0) return;

  const docketEntriesToUpsert = docketEntries.map(toKyselyNewDocketEntry);

  await pgInsertInto({
    table: 'dwDocketEntry',
    values: docketEntriesToUpsert,
    onConflictColumns: ['docketNumber', 'docketEntryId'],
    excludeFromUpdateColumns,
  });
};

export const upsertDocketEntries = withValidation(
  upsertDocketEntriesWithoutValidation,
);
