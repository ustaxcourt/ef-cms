import {
  calculateDate,
  FORMATS,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/database';
import { sql } from 'kysely';

export type ClerkDashboardMonthlyCount = {
  month: number; // 1–12
  electronic: number;
  paper: number;
};

export type ClerkDashboardProcedureTypeMonthlyCount = {
  month: number; // 1–12
  regular: number;
  small: number;
};

export type ClerkDashboardCaseTypeQuarterCount = {
  quarter: number; // 1–4
  caseType: string;
  count: number;
};

export type ClerkDashboardClosedMonthlyCount = {
  month: number;
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
        .select(sql<number>`EXTRACT(YEAR FROM received_at)`.as('year'))
        .orderBy(sql`EXTRACT(YEAR FROM received_at)`, 'desc')
        .limit(1)
        .executeTakeFirst();
      resolvedYear = latestRow
        ? Number(latestRow.year)
        : Number(formatNow(FORMATS.YEAR));
    }

    const yearStart = calculateDate({ dateString: `${resolvedYear}-01-01` });
    const yearEnd = calculateDate({ dateString: `${resolvedYear + 1}-01-01` });
    // ── Petitions by month (electronic/paper split) ──────────────────────────
    const petitionRows = await reader
      .selectFrom('dwCase')
      .where('receivedAt', '>=', yearStart)
      .where('receivedAt', '<', yearEnd)
      .select([
        sql<number>`EXTRACT(MONTH FROM received_at)`.as('month'),
        sql<number>`COUNT(*) FILTER (WHERE is_paper IS NOT TRUE)`.as(
          'electronic',
        ),
        sql<number>`COUNT(*) FILTER (WHERE is_paper IS TRUE)`.as('paper'),
      ])
      .groupBy(sql`EXTRACT(MONTH FROM received_at)`)
      .orderBy(sql`EXTRACT(MONTH FROM received_at)`, 'asc')
      .execute();

    // ── Cases filed by month (Regular vs Small procedureType split) ──────────
    const procedureTypeRows = await reader
      .selectFrom('dwCase')
      .where('receivedAt', '>=', yearStart)
      .where('receivedAt', '<', yearEnd)
      .select([
        sql<number>`EXTRACT(MONTH FROM received_at)`.as('month'),
        sql<number>`COUNT(*) FILTER (WHERE procedure_type = 'Regular')`.as(
          'regular',
        ),
        sql<number>`COUNT(*) FILTER (WHERE procedure_type = 'Small')`.as(
          'small',
        ),
      ])
      .groupBy(sql`EXTRACT(MONTH FROM received_at)`)
      .orderBy(sql`EXTRACT(MONTH FROM received_at)`, 'asc')
      .execute();

    // ── Closed cases by month (closedDate) ───────────────────────────────────
    const closedRows = await reader
      .selectFrom('dwCase')
      .where('closedDate', '>=', yearStart)
      .where('closedDate', '<', yearEnd)
      .select([
        sql<number>`EXTRACT(MONTH FROM closed_date)`.as('month'),
        sql<number>`COUNT(*) FILTER (WHERE status = 'Closed')`.as('closed'),
        sql<number>`COUNT(*) FILTER (WHERE status = 'Closed - Dismissed')`.as(
          'closedDismissed',
        ),
      ])
      .groupBy(sql`EXTRACT(MONTH FROM closed_date)`)
      .orderBy(sql`EXTRACT(MONTH FROM closed_date)`, 'asc')
      .execute();

    // ── Case type counts by quarter (receivedAt) ─────────────────────────────
    const caseTypeRows = await reader
      .selectFrom('dwCase')
      .where('receivedAt', '>=', yearStart)
      .where('receivedAt', '<', yearEnd)
      .select([
        sql<number>`EXTRACT(QUARTER FROM received_at)`.as('quarter'),
        'caseType',
        sql<number>`COUNT(*)`.as('count'),
      ])
      .groupBy([sql`EXTRACT(QUARTER FROM received_at)`, 'caseType'])
      .orderBy(sql`EXTRACT(QUARTER FROM received_at)`, 'asc')
      .execute();

    // ── Trial session proceeding type counts ─────────────────────────────────
    const proceedingTypeRows = await reader
      .selectFrom('dwTrialSession')
      .where('startDate', '>=', yearStart)
      .where('startDate', '<', yearEnd)
      .select(['proceedingType', sql<number>`COUNT(*)`.as('count')])
      .groupBy('proceedingType')
      .execute();

    // ── Trial session type counts ─────────────────────────────────────────────
    const sessionTypeRows = await reader
      .selectFrom('dwTrialSession')
      .where('startDate', '>=', yearStart)
      .where('startDate', '<', yearEnd)
      .select(['sessionType', sql<number>`COUNT(*)`.as('count')])
      .groupBy('sessionType')
      .execute();

    // ── Special sessions by location (top 10) ────────────────────────────────
    const specialSessionRows = await reader
      .selectFrom('dwTrialSession')
      .where('startDate', '>=', yearStart)
      .where('startDate', '<', yearEnd)
      .where('sessionType', '=', 'Special')
      .select(['trialLocation', sql<number>`COUNT(*)`.as('count')])
      .groupBy('trialLocation')
      .orderBy(sql`COUNT(*)`, 'desc')
      .limit(10)
      .execute();

    // ── Build full 12-month arrays (fill zeros for months with no data) ───────
    const petitionsByMonth = Array.from({ length: 12 }, (_, i) => {
      const row = petitionRows.find(r => Number(r.month) === i + 1);
      return {
        electronic: row ? Number(row.electronic) : 0,
        month: i + 1,
        paper: row ? Number(row.paper) : 0,
      };
    });

    const casesFiledByMonth = Array.from({ length: 12 }, (_, i) => {
      const row = procedureTypeRows.find(r => Number(r.month) === i + 1);
      return {
        month: i + 1,
        regular: row ? Number(row.regular) : 0,
        small: row ? Number(row.small) : 0,
      };
    });

    const closedByMonth = Array.from({ length: 12 }, (_, i) => {
      const row = closedRows.find(r => Number(r.month) === i + 1);
      return {
        closed: row ? Number(row.closed) : 0,
        closedDismissed: row ? Number(row.closedDismissed) : 0,
        month: i + 1,
      };
    });

    return {
      caseTypeByQuarter: caseTypeRows.map(r => ({
        caseType: r.caseType,
        count: Number(r.count),
        quarter: Number(r.quarter),
      })),
      casesFiledByMonth,
      closedCasesByMonth: closedByMonth,
      petitionsByMonth,
      proceedingTypeCounts: (() => {
        const PROCEEDING_TYPE_ORDER = ['In Person', 'Remote'];
        const mapped = proceedingTypeRows.map(r => ({
          count: Number(r.count),
          proceedingType: r.proceedingType,
        }));
        return mapped.sort((a, b) => {
          const aIdx = PROCEEDING_TYPE_ORDER.indexOf(a.proceedingType);
          const bIdx = PROCEEDING_TYPE_ORDER.indexOf(b.proceedingType);
          const aOrder = aIdx === -1 ? PROCEEDING_TYPE_ORDER.length : aIdx;
          const bOrder = bIdx === -1 ? PROCEEDING_TYPE_ORDER.length : bIdx;
          return aOrder - bOrder;
        });
      })(),
      sessionTypeCounts: (() => {
        const SESSION_TYPE_ORDER = [
          'Regular',
          'Hybrid',
          'Small',
          'Hybrid-S',
          'Motion/Hearing',
          'Special',
        ];
        const mapped = sessionTypeRows.map(r => ({
          count: Number(r.count),
          sessionType: r.sessionType,
        }));
        return mapped.sort((a, b) => {
          const aIdx = SESSION_TYPE_ORDER.indexOf(a.sessionType);
          const bIdx = SESSION_TYPE_ORDER.indexOf(b.sessionType);
          const aOrder = aIdx === -1 ? SESSION_TYPE_ORDER.length : aIdx;
          const bOrder = bIdx === -1 ? SESSION_TYPE_ORDER.length : bIdx;
          return aOrder - bOrder;
        });
      })(),
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
