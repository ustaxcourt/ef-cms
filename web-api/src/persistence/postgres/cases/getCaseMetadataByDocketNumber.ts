import { rawCaseEntity } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { sql } from 'kysely';
import {
  Petitioner,
  RawPetitioner,
} from '@shared/business/entities/contacts/Petitioner';

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
      .select(
        sql`jsonb_agg(to_jsonb(p) ORDER BY p.order_on_case)`.as('petitioners'),
      )
      .where('c.docketNumber', '=', docketNumber)
      .groupBy('c.docketNumber')
      .executeTakeFirst(),
  );

  return dbCase
    ? {
        ...transformNullToUndefined(rawCaseEntity(dbCase)),
        petitioners:
          (dbCase.petitioners as RawPetitioner[]).map(p => {
            if (!p) {
              return;
            }
            return new Petitioner({
              ...transformNullToUndefined(p),
              state: p.state || null, // this needs to be null
            }).toRawObject();
          }) || [],
      }
    : undefined;
};
