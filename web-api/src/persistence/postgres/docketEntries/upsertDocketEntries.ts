import { toKyselyNewDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
// import { withValidation } from '@web-api/persistence/postgres/utils/withValidation';

const upsertDocketEntriesWithoutValidation = async (
  docketEntries: RawDocketEntry[],
) => {
  if (docketEntries.length === 0) return;

  const docketEntriesToUpsert = docketEntries.map(toKyselyNewDocketEntry);

  await pgInsertInto({
    table: 'dwDocketEntry',
    values: docketEntriesToUpsert,
    onConflictColumns: ['docketNumber', 'docketEntryId'],
  });
};

// 10494: This is causing issues we need to resolve--we cannot create a case with this active
// export const upsertDocketEntries = withValidation(
//   upsertDocketEntriesWithoutValidation,
// );

export const upsertDocketEntries = upsertDocketEntriesWithoutValidation;
