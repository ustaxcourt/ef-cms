import { getDbReader } from '@web-api/persistence/postgres/database';
import { sql } from 'kysely';

export const petitionsDataByYear = async (
  yearStart: Date,
  yearEnd: Date,
): Promise<
  {
    isPaper: boolean | null;
    isRepresenting: boolean | null;
    month: number | null;
    total: number;
  }[]
> => {
  return getDbReader(async reader => {
    return reader
      .selectFrom(eb =>
        eb
          .selectFrom('dwCase')
          .leftJoin(
            eb2 =>
              eb2
                .selectFrom('dwUserOnCase')
                .select('docketNumber')
                .where('representing', 'is not', null)
                .groupBy('docketNumber')
                .as('uoc'),
            join => join.onRef('dwCase.docketNumber', '=', 'uoc.docketNumber'),
          )
          .select(eb => [
            'receivedAt',
            eb.fn.coalesce('isPaper', eb.lit(false)).as('isPaper'),
            sql<boolean>`CASE
                          WHEN uoc.docket_number IS NULL THEN FALSE
                          ELSE TRUE
                        END`.as('isRepresenting'),
          ])
          .where('receivedAt', '>=', yearStart)
          .where('receivedAt', '<', yearEnd)
          .as('middle'),
      )
      .select([
        'isPaper',
        'isRepresenting',
        sql<number>`EXTRACT(MONTH FROM ${sql.ref('receivedAt')} AT TIME ZONE 'America/New_York')`.as(
          'month',
        ),
        sql<number>`count(1)`.as('total'),
      ])
      .groupBy(
        sql`grouping sets((EXTRACT(MONTH FROM received_at AT TIME ZONE 'America/New_York'), is_paper), (is_Paper), (is_Representing))`,
      )
      .execute();
  });
};
