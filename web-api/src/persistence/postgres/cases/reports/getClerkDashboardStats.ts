import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { Database } from '@web-api/persistence/postgres/database-schema';
import { Kysely, sql } from 'kysely';
import { orderBy } from 'lodash';

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
  petitionFullPaperMonths: {
    month: Month;
    isPaper: boolean | undefined;
    total: number;
  }[];
  petitionFullElectronicMonths: {
    month: Month;
    isPaper: boolean | undefined;
    total: number;
  }[];
  petitionsByServiceType: {
    total: number;
    isPaper: boolean;
  }[];
  petitionsByRepresentation: {
    total: number;
    isRepresenting: boolean;
  }[];
};

async function _top10SpecialSessionLocations(
  reader: Kysely<Database>,
  yearStart: Date,
  yearEnd: Date,
) {
  return await reader
    .selectFrom('dwTrialSession')
    .where('startDate', '>=', yearStart)
    .where('startDate', '<', yearEnd)
    .where('sessionType', '=', 'Special')
    .select(({ fn }) => ['trialLocation', fn.countAll<number>().as('count')])
    .groupBy('trialLocation')
    .orderBy(eb => eb.fn.countAll(), 'desc')
    .limit(10)
    .execute();
}

async function _sessionTypeCounts(
  reader: Kysely<Database>,
  yearStart: Date,
  yearEnd: Date,
) {
  return await reader
    .selectFrom('dwTrialSession')
    .where('startDate', '>=', yearStart)
    .where('startDate', '<', yearEnd)
    .select(({ fn }) => ['sessionType', fn.countAll<number>().as('count')])
    .groupBy('sessionType')
    .execute();
}

async function _trialSessionProceedingTypes(
  reader: Kysely<Database>,
  yearStart: Date,
  yearEnd: Date,
) {
  return await reader
    .selectFrom('dwTrialSession')
    .where('startDate', '>=', yearStart)
    .where('startDate', '<', yearEnd)
    .select(({ fn }) => ['proceedingType', fn.countAll<number>().as('count')])
    .groupBy('proceedingType')
    .execute();
}

async function _caseTypesByQuarter(
  reader: Kysely<Database>,
  yearStart: Date,
  yearEnd: Date,
) {
  return await reader
    .selectFrom('dwCase')
    .where('receivedAt', '>=', yearStart)
    .where('receivedAt', '<', yearEnd)
    .select(({ fn }) => [
      sql<number>`EXTRACT(QUARTER FROM ${sql.ref('receivedAt')})`.as('quarter'),
      'caseType',
      fn.countAll<number>().as('count'),
    ])
    .groupBy([sql`EXTRACT(QUARTER FROM ${sql.ref('receivedAt')})`, 'caseType'])
    .orderBy(sql`EXTRACT(QUARTER FROM ${sql.ref('receivedAt')})`, 'asc')
    .execute();
}

async function _closedCasesByMonth(
  reader: Kysely<Database>,
  yearStart: Date,
  yearEnd: Date,
) {
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

  const closedByMonth = Array.from({ length: 12 }, (_, i) => {
    const row = closedRows.find(r => Number(r.month) === i + 1);
    return {
      closed: row ? Number(row.closed) : 0,
      closedDismissed: row ? Number(row.closedDismissed) : 0,
      month: (i + 1) as Month,
    };
  });
  return closedByMonth;
}

async function _casesByMonthAndProcedureType(
  reader: Kysely<Database>,
  yearStart: Date,
  yearEnd: Date,
) {
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

  const casesFiledByMonth = Array.from({ length: 12 }, (_, i) => {
    const row = procedureTypeRows.find(r => Number(r.month) === i + 1);
    return {
      month: (i + 1) as Month,
      regular: row ? Number(row.regular) : 0,
      small: row ? Number(row.small) : 0,
    };
  });
  return casesFiledByMonth;
}

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

    // const yearStart = calculateDate({
    //   dateString: `${resolvedYear}-01-01T00:00:00.000Z`,
    // });

    // -- Petition Data ---------------------
    const petitionData = await reader
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
          // .where() YEAR CONDITION
          .as('middle'),
      )
      .select([
        'isPaper',
        'isRepresenting',
        sql<number>`EXTRACT(MONTH FROM ${sql.ref('receivedAt')})`.as('month'),
        sql<number>`count(1)`.as('total'),
      ])
      .groupBy(
        sql`grouping sets((EXTRACT(MONTH FROM received_At), is_paper), (is_Paper), (is_Representing))`,
      )
      .execute();

    const petitonPaperMonths = petitionData.filter(
      pet => pet.isPaper && pet.month,
    );
    const petitonElectronicMonths = petitionData.filter(
      pet => !pet.isPaper && pet.isPaper != null && pet.month,
    );
    const petitionsByServiceType = petitionData
      .filter(pet => pet.isPaper != null && !pet.month)
      .map(pet => ({ total: Number(pet.total), isPaper: pet.isPaper }));
    const petitionsByRepresentation = petitionData
      .filter(pet => pet.isRepresenting != null)
      .map(pet => ({
        total: Number(pet.total),
        isRepresenting: pet.isRepresenting,
      }));

    const petitionFullPaperMonths = Array.from({ length: 12 }, (_, i) => {
      const row = petitonPaperMonths.find(r => Number(r.month) === i + 1);
      return {
        month: (i + 1) as Month,
        isPaper: row ? row.isPaper : undefined,
        total: row ? Number(row.total) : 0,
      };
    });

    const petitionFullElectronicMonths = Array.from({ length: 12 }, (_, i) => {
      const row = petitonElectronicMonths.find(r => Number(r.month) === i + 1);
      return {
        month: (i + 1) as Month,
        isPaper: row ? row.isPaper : undefined,
        total: row ? Number(row.total) : 0,
      };
    });

    return {
      petitionFullPaperMonths: orderBy(petitionFullPaperMonths, ['month']),
      petitionFullElectronicMonths: orderBy(petitionFullElectronicMonths, [
        'month',
      ]),
      petitionsByServiceType,
      petitionsByRepresentation,
      year: resolvedYear,
    };
  });
};
