import { convertDbRowToRawCase } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { sql } from 'kysely';

export const getCaseMetadataByDocketNumber = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<RawCase | undefined> => {
  const dbCase = await getDbReader(reader =>
    reader
      .selectFrom('dwCase as c')
      .leftJoin('dwPetitionerOnCase as p', 'c.docketNumber', 'p.docketNumber')
      .selectAll('c')
      .select(sql`jsonb_agg(to_jsonb(p))`.as('petitioners'))
      .orderBy('orderOnCase', 'asc')
      .where('c.docketNumber', '=', docketNumber)
      .groupBy('c.docketNumber')
      .executeTakeFirst(),
  );

  return dbCase
    ? {
        ...transformNullToUndefined(convertDbRowToRawCase(dbCase)),
        petitioners: dbCase.petitioners,
      }
    : undefined;
};
