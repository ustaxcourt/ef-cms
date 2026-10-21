import {
  CASE_STATUS_TYPES,
  CLOSED_CASE_STATUSES,
} from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { sql } from 'kysely';

export type CaseStatusChangeGroup = 'closed' | 'onAppeal';

/** Counts the cases that are open now and were received within the given timeframe */
export const openCasesByProcedureType = async (
  yearStart: Date,
  yearEnd: Date,
): Promise<
  {
    procedureType: string;
    total: number;
  }[]
> => {
  return getDbReader(async reader => {
    return reader
      .selectFrom('dwCase')
      .select(['procedureType', sql<number>`count(1)`.as('total')])
      .where('status', 'not in', CLOSED_CASE_STATUSES)
      .where('receivedAt', '>=', yearStart)
      .where('receivedAt', '<', yearEnd)
      .groupBy('procedureType')
      .execute();
  });
};

/** Counts the cases that are open now and were received within the given timeframe */
export const openCasesByCaseType = async (
  yearStart: Date,
  yearEnd: Date,
): Promise<
  {
    caseType: string;
    total: number;
  }[]
> => {
  return getDbReader(async reader => {
    return reader
      .selectFrom('dwCase')
      .select(['caseType', sql<number>`count(1)`.as('total')])
      .where('status', 'not in', CLOSED_CASE_STATUSES)
      .where('receivedAt', '>=', yearStart)
      .where('receivedAt', '<', yearEnd)
      .groupBy('caseType')
      .execute();
  });
};

/**
 * Counts the times a case's status was changed to Closed/Closed - Dismissed or
 * On Appeal within the given timeframe, grouped by month and by procedure type.
 * Each change counts, so a case closed, reopened, and closed again counts twice.
 * A change between Closed and Closed - Dismissed is not a new closure.
 */
export const caseStatusChangesByYear = async (
  yearStart: Date,
  yearEnd: Date,
): Promise<
  {
    month: number | null;
    procedureType: string | null;
    statusGroup: CaseStatusChangeGroup;
    total: number;
  }[]
> => {
  return getDbReader(async reader => {
    return reader
      .selectFrom(eb =>
        eb
          .selectFrom(eb2 =>
            eb2
              .selectFrom(eb3 =>
                eb3
                  .selectFrom('dwCase')
                  .select([
                    'docketNumber',
                    'procedureType',
                    sql`jsonb_array_elements(case_status_history)`.as(
                      'statusChange',
                    ),
                  ])
                  .where(sql`jsonb_typeof(case_status_history)`, '=', 'array')
                  // only expand the histories of cases with a status change in the timeframe;
                  // their full history is still expanded, so LAG sees the change before it
                  .where(
                    sql<boolean>`EXISTS (
                      SELECT 1 FROM jsonb_array_elements(case_status_history) AS change
                      WHERE (change->>'date')::timestamptz >= ${yearStart}
                        AND (change->>'date')::timestamptz < ${yearEnd}
                    )`,
                  )
                  .as('statusChanges'),
              )
              .select([
                'procedureType',
                sql<string>`status_change->>'updatedCaseStatus'`.as(
                  'updatedCaseStatus',
                ),
                sql<Date>`(status_change->>'date')::timestamptz`.as(
                  'changedAt',
                ),
                // the previous status is taken from the full history, before the timeframe filter
                sql<
                  string | null
                >`LAG(status_change->>'updatedCaseStatus') OVER (PARTITION BY docket_number ORDER BY (status_change->>'date')::timestamptz)`.as(
                  'previousCaseStatus',
                ),
              ])
              .as('orderedStatusChanges'),
          )
          .select([
            'procedureType',
            sql<CaseStatusChangeGroup>`CASE
                          WHEN updated_case_status = ${CASE_STATUS_TYPES.onAppeal} THEN 'onAppeal'
                          ELSE 'closed'
                        END`.as('statusGroup'),
            sql<number>`EXTRACT(MONTH FROM changed_at AT TIME ZONE 'America/New_York')`.as(
              'month',
            ),
          ])
          .where('changedAt', '>=', yearStart)
          .where('changedAt', '<', yearEnd)
          .where(
            sql<boolean>`((
              updated_case_status IN (${sql.join(CLOSED_CASE_STATUSES)})
              AND (previous_case_status IS NULL OR previous_case_status NOT IN (${sql.join(CLOSED_CASE_STATUSES)}))
            ) OR (
              updated_case_status = ${CASE_STATUS_TYPES.onAppeal}
              AND previous_case_status IS DISTINCT FROM ${CASE_STATUS_TYPES.onAppeal}
            ))`,
          )
          .as('middle'),
      )
      .select([
        'statusGroup',
        'procedureType',
        'month',
        sql<number>`count(1)`.as('total'),
      ])
      .groupBy(
        sql`grouping sets((status_group, month), (status_group, procedure_type))`,
      )
      .execute();
  });
};

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
        sql<number>`EXTRACT(MONTH FROM received_at AT TIME ZONE 'America/New_York')`.as(
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
