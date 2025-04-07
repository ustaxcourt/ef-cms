import { toKyselyNewDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertDocketEntries = async (docketEntries: RawDocketEntry[]) => {
  if (docketEntries.length === 0) return;

  const docketEntriesToUpsert = docketEntries.map(toKyselyNewDocketEntry);

  await pgInsertInto({
    table: 'dwDocketEntry',
    values: docketEntriesToUpsert,
    onConflictColumns: ['docketNumber', 'docketEntryId'],
  });
};
