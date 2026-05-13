import {
  calculateDate,
  FORMATS,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { sql } from 'kysely';

export enum Month {
  January = 1,
  February = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12,
}

export enum Quarter {
  Q1 = 1,
  Q2 = 2,
  Q3 = 3,
  Q4 = 4,
}

export type ClerkDashboardMonthlyCount = {
  month: Month;
  electronic: number;
  paper: number;
};

export type ClerkDashboardProcedureTypeMonthlyCount = {
  month: Month;
  regular: number;
  small: number;
};

export type ClerkDashboardCaseTypeQuarterCount = {
  quarter: Quarter;
  caseType: string;
  count: number;
};

export type ClerkDashboardClosedMonthlyCount = {
  month: Month;
  closed: number;
  closedDismissed: number;
};

export type ClerkDashboardProceedingTypeCount = {
  proceedingType: string;
  count: number;
};

export type ClerkDashboardSessionTypeCount = {
  sessionType: string;
  count: number;
};

export type ClerkDashboardSpecialSessionLocation = {
  trialLocation: string;
  count: number;
};

export type ClerkDashboardStats = {
  year: number;
  petitionsByMonth: ClerkDashboardMonthlyCount[];
  casesFiledByMonth: ClerkDashboardProcedureTypeMonthlyCount[];
  closedCasesByMonth: ClerkDashboardClosedMonthlyCount[];
  caseTypeByQuarter: ClerkDashboardCaseTypeQuarterCount[];
  proceedingTypeCounts: ClerkDashboardProceedingTypeCount[];
  sessionTypeCounts: ClerkDashboardSessionTypeCount[];
  specialSessionsByLocation: ClerkDashboardSpecialSessionLocation[];
};

const sortByOrder = <T>(items: T[], order: string[], key: keyof T): T[] =>
  [...items].sort((a, b) => {
    const aIdx = order.indexOf(a[key] as string);
    const bIdx = order.indexOf(b[key] as string);
    const aOrder = aIdx === -1 ? order.length : aIdx;
    const bOrder = bIdx === -1 ? order.length : bIdx;
    return aOrder - bOrder;
  });

export const getClerkDashboardStats = async ({
  year,
}: {
  year?: number;
}): Promise<ClerkDashboardStats> => {
  return await getDbReader(async reader => {
    // ── Auto-detect most recent year with data if none provided ───────────────
    let resolvedYear = year;
    if (!resolvedYear) {
      const latestRow = await reader
        .selectFrom('dwCase')
        .select(
          sql<number>`EXTRACT(YEAR FROM ${sql.ref('receivedAt')})`.as('year'),
        )
        .orderBy(sql`EXTRACT(YEAR FROM ${sql.ref('receivedAt')})`, 'desc')
        .limit(1)
        .executeTakeFirst();
      resolvedYear = latestRow
        ? Number(latestRow.year)
        : Number(formatNow(FORMATS.YEAR));
    }

    const yearStart = calculateDate({
      dateString: `${resolvedYear}-01-01T00:00:00.000Z`,
    });
    const yearEnd = calculateDate({
      dateString: `${resolvedYear + 1}-01-01T00:00:00.000Z`,
    });
    // ── Petitions by month (electronic/paper split) ──────────────────────────
    const petitionRows = await reader
      .selectFrom('dwCase')
      .where('receivedAt', '>=', yearStart)
      .where('receivedAt', '<', yearEnd)
      .select(({ fn }) => [
        sql<number>`EXTRACT(MONTH FROM ${sql.ref('receivedAt')})`.as('month'),
        fn
          .countAll<number>()
          .filterWhere('isPaper', 'is not', true)
          .as('electronic'),
        fn.countAll<number>().filterWhere('isPaper', '=', true).as('paper'),
      ])
      .groupBy(sql`EXTRACT(MONTH FROM ${sql.ref('receivedAt')})`)
      .orderBy(sql`EXTRACT(MONTH FROM ${sql.ref('receivedAt')})`, 'asc')
      .execute();

    // ── Cases filed by month (Regular vs Small procedureType split) ──────────
    const procedureTypeRows = await reader
      .selectFrom('dwCase')
      .where('receivedAt', '>=', yearStart)
      .where('receivedAt', '<', yearEnd)
      .select(({ fn }) => [
        sql<number>`EXTRACT(MONTH FROM ${sql.ref('receivedAt')})`.as('month'),
        fn
          .countAll<number>()
          .filterWhere('procedureType', '=', 'Regular')
          .as('regular'),
        fn
          .countAll<number>()
          .filterWhere('procedureType', '=', 'Small')
          .as('small'),
      ])
      .groupBy(sql`EXTRACT(MONTH FROM ${sql.ref('receivedAt')})`)
      .orderBy(sql`EXTRACT(MONTH FROM ${sql.ref('receivedAt')})`, 'asc')
      .execute();

    // ── Closed cases by month (closedDate) ───────────────────────────────────
    const closedRows = await reader
      .selectFrom('dwCase')
      .where('closedDate', '>=', yearStart)
      .where('closedDate', '<', yearEnd)
      .select(({ fn }) => [
        sql<number>`EXTRACT(MONTH FROM ${sql.ref('closedDate')})`.as('month'),
        fn.countAll<number>().filterWhere('status', '=', 'Closed').as('closed'),
        fn
          .countAll<number>()
          .filterWhere('status', '=', 'Closed - Dismissed')
          .as('closedDismissed'),
      ])
      .groupBy(sql`EXTRACT(MONTH FROM ${sql.ref('closedDate')})`)
      .orderBy(sql`EXTRACT(MONTH FROM ${sql.ref('closedDate')})`, 'asc')
      .execute();

    // ── Case type counts by quarter (receivedAt) ─────────────────────────────
    const caseTypeRows = await reader
      .selectFrom('dwCase')
      .where('receivedAt', '>=', yearStart)
      .where('receivedAt', '<', yearEnd)
      .select(({ fn }) => [
        sql<number>`EXTRACT(QUARTER FROM ${sql.ref('receivedAt')})`.as(
          'quarter',
        ),
        'caseType',
        fn.countAll<number>().as('count'),
      ])
      .groupBy([
        sql`EXTRACT(QUARTER FROM ${sql.ref('receivedAt')})`,
        'caseType',
      ])
      .orderBy(sql`EXTRACT(QUARTER FROM ${sql.ref('receivedAt')})`, 'asc')
      .execute();

    // ── Trial session proceeding type counts ─────────────────────────────────
    const proceedingTypeRows = await reader
      .selectFrom('dwTrialSession')
      .where('startDate', '>=', yearStart)
      .where('startDate', '<', yearEnd)
      .select(({ fn }) => ['proceedingType', fn.countAll<number>().as('count')])
      .groupBy('proceedingType')
      .execute();

    // ── Trial session type counts ─────────────────────────────────────────────
    const sessionTypeRows = await reader
      .selectFrom('dwTrialSession')
      .where('startDate', '>=', yearStart)
      .where('startDate', '<', yearEnd)
      .select(({ fn }) => ['sessionType', fn.countAll<number>().as('count')])
      .groupBy('sessionType')
      .execute();

    // ── Special sessions by location (top 10) ────────────────────────────────
    const specialSessionRows = await reader
      .selectFrom('dwTrialSession')
      .where('startDate', '>=', yearStart)
      .where('startDate', '<', yearEnd)
      .where('sessionType', '=', 'Special')
      .select(({ fn }) => ['trialLocation', fn.countAll<number>().as('count')])
      .groupBy('trialLocation')
      .orderBy(eb => eb.fn.countAll(), 'desc')
      .limit(10)
      .execute();

    // ── Build full 12-month arrays (fill zeros for months with no data) ───────
    const petitionsByMonth = Array.from({ length: 12 }, (_, i) => {
      const row = petitionRows.find(r => Number(r.month) === i + 1);
      return {
        electronic: row ? Number(row.electronic) : 0,
        month: (i + 1) as Month,
        paper: row ? Number(row.paper) : 0,
      };
    });

    const casesFiledByMonth = Array.from({ length: 12 }, (_, i) => {
      const row = procedureTypeRows.find(r => Number(r.month) === i + 1);
      return {
        month: (i + 1) as Month,
        regular: row ? Number(row.regular) : 0,
        small: row ? Number(row.small) : 0,
      };
    });

    const closedByMonth = Array.from({ length: 12 }, (_, i) => {
      const row = closedRows.find(r => Number(r.month) === i + 1);
      return {
        closed: row ? Number(row.closed) : 0,
        closedDismissed: row ? Number(row.closedDismissed) : 0,
        month: (i + 1) as Month,
      };
    });

    return {
      caseTypeByQuarter: caseTypeRows.map(r => ({
        caseType: r.caseType,
        count: Number(r.count),
        quarter: Number(r.quarter) as Quarter,
      })),
      casesFiledByMonth,
      closedCasesByMonth: closedByMonth,
      petitionsByMonth,
      proceedingTypeCounts: sortByOrder(
        ['In Person', 'Remote'].map(proceedingType => {
          const row = proceedingTypeRows.find(
            r => r.proceedingType === proceedingType,
          );
          return { count: row ? Number(row.count) : 0, proceedingType };
        }),
        ['In Person', 'Remote'],
        'proceedingType',
      ),
      sessionTypeCounts: sortByOrder(
        [
          'Regular',
          'Hybrid',
          'Small',
          'Hybrid-S',
          'Motion/Hearing',
          'Special',
        ].map(sessionType => {
          const row = sessionTypeRows.find(r => r.sessionType === sessionType);
          return { count: row ? Number(row.count) : 0, sessionType };
        }),
        ['Regular', 'Hybrid', 'Small', 'Hybrid-S', 'Motion/Hearing', 'Special'],
        'sessionType',
      ),
      specialSessionsByLocation: specialSessionRows
        .filter(r => r.trialLocation !== null)
        .map(r => ({
          count: Number(r.count),
          trialLocation: r.trialLocation as string,
        })),
      year: resolvedYear,
    };
  });
};
