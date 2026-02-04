import { docketEntriesBaseQuery } from '@web-api/persistence/postgres/docketEntries/commonQueries';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';

// Batch size chosen to avoid Kysely's SnakeCaseTransformer stack overflow
// when building deeply nested OR queries. 200 provides safety margin.
const BATCH_SIZE = 2000;

export const getDocketEntriesByDocketNumberAndDocketEntryId = async ({
  docketNumbersAndIds,
}: {
  docketNumbersAndIds: {
    docketNumber: string;
    docketEntryId: string;
  }[];
}): Promise<RawDocketEntry[]> => {
  if (docketNumbersAndIds.length === 0) {
    return [];
  }

  // Batch the queries to avoid stack overflow from deeply nested OR conditions
  const batches: { docketNumber: string; docketEntryId: string }[][] = [];
  for (let i = 0; i < docketNumbersAndIds.length; i += BATCH_SIZE) {
    batches.push(docketNumbersAndIds.slice(i, i + BATCH_SIZE));
  }

  const results = await Promise.all(
    batches.map(async batch => {
      const batchDocketNumbers = [...new Set(batch.map(p => p.docketNumber))];
      const query = (
        await docketEntriesBaseQuery({ docketNumbers: batchDocketNumbers })
      ).where(qb =>
        qb.or(
          batch.map(pair =>
            qb.and([
              qb('de.docketEntryId', '=', pair.docketEntryId),
              qb('de.docketNumber', '=', pair.docketNumber),
            ]),
          ),
        ),
      );

      // Log SQL for debugging - use .compile() to get SQL without executing
      const compiled = query.compile();
      console.log('=== SQL Query ===');
      console.log(compiled.sql);
      console.log('=== Parameters (first 10) ===');
      console.log(compiled.parameters.slice(0, 10));
      console.log(`=== Total parameters: ${compiled.parameters.length} ===`);

      const dbDocketEntries = await query.execute();
      return dbDocketEntries;
    }),
  );

  return results.flat().map(d => fromKyselyDocketEntry(d));
};
