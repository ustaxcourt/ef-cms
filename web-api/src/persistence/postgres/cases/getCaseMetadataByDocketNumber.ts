import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';
import { sql } from 'kysely';
import { Case } from '@shared/business/entities/cases/Case';

export const getCaseMetadataByDocketNumber = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<
  | Omit<RawCase, 'consolidatedCases' | 'correspondence' | 'docketEntries'>
  | undefined
> => {
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
    ? fromKyselyCase({
        ...dbCase,
        petitioners: dbCase.petitioners as TPetitioner[], // This is a hack because our typing for Petitioners is yucky
        docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
          docketNumber: dbCase.docketNumber,
          docketNumberSuffix: dbCase.docketNumberSuffix,
        }),
      })
    : undefined;
};
