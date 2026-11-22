import {
  CASE_STATUS_TYPES,
  CLOSED_CASE_STATUSES,
} from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { RawBuilder, sql } from 'kysely';

export type CaseStatusChangeGroup = 'closed' | 'onAppeal';

type Timeframe = { begin: Date; end: Date };

/**
 * Counts the open cases by procedure type and by case type in one scan.
 * A procedure type row has a null caseType, and a case type row has a null procedureType.
 */
export const openCasesByProcedureTypeAndCaseType = async (): Promise<
  {
    caseType: string | null;
    procedureType: string | null;
    total: number;
  }[]
> => {
  return getDbReader(async reader => {
    return reader
      .selectFrom('dwCase')
      .select(['procedureType', 'caseType', sql<number>`count(1)`.as('total')])
      .where('status', 'not in', CLOSED_CASE_STATUSES)
      .groupBy(sql`grouping sets((procedure_type), (case_type))`)
      .execute();
  });
};

/**
 * Counts the times a case's status was changed to Closed/Closed - Dismissed or
 * On Appeal within the calendar year and within the fiscal year, grouped by month
 * and by procedure type. One pass over the histories covers both timeframes.
 * Each change counts, so a case closed, reopened, and closed again counts twice.
 * A change between Closed and Closed - Dismissed is not a new closure.
 */
export const caseStatusChangesByYear = async ({
  calendarYear,
  fiscalYear,
}: {
  calendarYear: Timeframe;
  fiscalYear: Timeframe;
}): Promise<
  {
    calendarYearTotal: number;
    fiscalYearTotal: number;
    month: number | null;
    procedureType: string | null;
    statusGroup: CaseStatusChangeGroup;
  }[]
> => {
  // the query reads from the earliest begin to the latest end of the two timeframes
  const begin =
    calendarYear.begin < fiscalYear.begin
      ? calendarYear.begin
      : fiscalYear.begin;
  const end =
    calendarYear.end > fiscalYear.end ? calendarYear.end : fiscalYear.end;
  const isWithin = (timeframe: Timeframe): RawBuilder<boolean> =>
    sql<boolean>`changed_at >= ${timeframe.begin} AND changed_at < ${timeframe.end}`;

  return getDbReader(async reader => {
    return reader
      .selectFrom(eb =>
        eb
          .selectFrom('dwCase')
          // each case's own changes, each with the status before it; the previous status comes
          // from date order, not array order, because scripts can append back-dated changes to
          // the end of the history, and the array position breaks ties between equal dates
          .crossJoinLateral(
            sql`(
              SELECT
                status_change->>'updatedCaseStatus' AS updated_case_status,
                (status_change->>'date')::timestamptz AS changed_at,
                LAG(status_change->>'updatedCaseStatus') OVER (
                  ORDER BY (status_change->>'date')::timestamptz, change_number
                ) AS previous_case_status
              FROM jsonb_array_elements(case_status_history) WITH ORDINALITY AS history(status_change, change_number)
            )`.as<'statusChanges'>(
              sql`status_changes(updated_case_status, changed_at, previous_case_status)`,
            ),
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
            isWithin(calendarYear).as('isInCalendarYear'),
            isWithin(fiscalYear).as('isInFiscalYear'),
          ])
          .where(sql`jsonb_typeof(case_status_history)`, '=', 'array')
          .where(sql`changed_at`, '>=', begin)
          .where(sql`changed_at`, '<', end)
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
        sql<number>`count(1) FILTER (WHERE is_in_calendar_year)`.as(
          'calendarYearTotal',
        ),
        sql<number>`count(1) FILTER (WHERE is_in_fiscal_year)`.as(
          'fiscalYearTotal',
        ),
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
