import { getDbReader } from '@web-api/database';
import {
  docketEntriesBaseQuery,
  DocketEntryWithAffected,
} from './commonQueries';
import { fromKyselyDocketEntry } from './mapper';
import { sql } from 'kysely';

export const getDocketEntriesPaginated = async ({
  docketNumber,
  filterOnDocketRecord = false,
  page = 0,
  pageSize,
}: {
  docketNumber: string;
  page: number;
  pageSize: number;
  filterOnDocketRecord?: boolean;
}): Promise<{
  docketEntries: RawDocketEntry[];
  archivedDocketEntries: RawDocketEntry[];
  totalCount: number;
}> => {
  const baseQuery = await docketEntriesBaseQuery({
    docketNumbers: [docketNumber],
  });

  let activeQuery = baseQuery.where('de.archived', 'is not', true);

  if (filterOnDocketRecord) {
    activeQuery = activeQuery.where('de.isOnDocketRecord', '=', true);
  }

  const paginatedQuery = activeQuery
    .orderBy('de.createdAt', 'asc')
    .orderBy('de.docketEntryId', 'asc')
    .limit(pageSize)
    .offset(page * pageSize);

  const countQuery = getDbReader(reader => {
    let q = reader
      .selectFrom('dwDocketEntry as de')
      .where('de.docketNumber', '=', docketNumber)
      .where('de.archived', 'is not', true);

    if (filterOnDocketRecord) {
      q = q.where('de.isOnDocketRecord', '=', true);
    }

    return q
      .select(sql<number>`count(*)::int`.as('count'))
      .executeTakeFirstOrThrow();
  });

  let archivedQuery: Promise<DocketEntryWithAffected[]>;
  if (page === 0) {
    archivedQuery = (async () => {
      const archiveBase = await docketEntriesBaseQuery({
        docketNumbers: [docketNumber],
      });
      return archiveBase.where('de.archived', '=', true).execute();
    })();
  } else {
    archivedQuery = Promise.resolve([]);
  }

  const [paginatedEntries, countResult, archivedEntries] = await Promise.all([
    paginatedQuery.execute(),
    countQuery,
    archivedQuery,
  ]);

  return {
    archivedDocketEntries: archivedEntries.map(e => fromKyselyDocketEntry(e)),
    docketEntries: paginatedEntries.map(e => fromKyselyDocketEntry(e)),
    totalCount: countResult.count,
  };
};
