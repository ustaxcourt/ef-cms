import { Case } from '@shared/business/entities/cases/Case';
import { RawPenalty } from '@shared/business/entities/Penalty';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { applicationContext } from '@web-api/applicationContext';
import { getDbReader } from '@web-api/database';
import { NotFoundError } from '@web-api/errors/errors';
import { getDocketEntryOnCase } from '@web-api/persistence/dynamo/cases/getDocketEntryOnCase';
import { purgeDynamoKeys } from '@web-api/persistence/dynamo/helpers/purgeDynamoKeys';
import { getIrsPractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getIrsPractitionersOnCase';
import { getPrivatePractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getPrivatePractitionersOnCase';
import { queryFull } from '@web-api/persistence/dynamodbClientService';
import { caseCorrespondenceEntity } from '@web-api/persistence/postgres/caseCorrespondences/mapper';
import { CaseCorrespondenceKysely } from '@web-api/persistence/postgres/caseCorrespondences/schema';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import {
  CaseKysely,
  CaseStatusUpdateKysely,
} from '@web-api/persistence/postgres/cases/schema';
import { sortStatistics } from '@web-api/persistence/postgres/cases/statistics/helper';
import {
  CaseStatisticKysely,
  StatisticPenaltyKysely,
} from '@web-api/persistence/postgres/cases/statistics/schema';
import { sql } from 'kysely';
import { difference, isEmpty, partition, sortBy } from 'lodash';

export async function getCasesByDocketNumbers({
  docketNumbers,
}: {
  docketNumbers: string[];
}): Promise<Omit<RawCase, 'consolidatedCases'>[]> {
  if (isEmpty(docketNumbers)) {
    return [];
  }
  const casesData = await getAllCaseData({ docketNumbers });
  const casesDataSorted = sortCaseFields({ cases: casesData, docketNumbers });
  const rawCases = casesDataSorted.map(c => convertDbCaseToRawCase(c));
  return rawCases;
}

async function getAllCaseData({
  docketNumbers,
}: {
  docketNumbers: string[];
}): Promise<EnrichedCaseRow[]> {
  const [
    cases,
    statistics,
    practitionerInfo,
    docketEntriesFromDb,
    caseStatusHistories,
    caseCorrespondences,
    hearings,
  ] = await Promise.all([
    getCasesMetadata(docketNumbers),
    getStatistics(docketNumbers),
    getPractitioners(docketNumbers, applicationContext),
    getDocketEntries(docketNumbers, applicationContext),
    getCasesStatusHistory(docketNumbers),
    getCaseCorrespondenceByDocketNumber(docketNumbers),
    getHearings(docketNumbers),
  ]);

  const notFoundCases = difference(
    docketNumbers,
    cases.map(c => c.docketNumber),
  );
  if (!isEmpty(notFoundCases)) {
    throw new NotFoundError(`Cases ${notFoundCases.join(', ')} not found`);
  }

  const caseMap: Map<string, EnrichedCaseRow> = new Map();
  cases.forEach(c => {
    caseMap.set(c.docketNumber, {
      ...c,
      docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
        docketNumber: c.docketNumber,
        docketNumberSuffix: c.docketNumberSuffix,
      }),
      petitioners: [],
      statistics: [],
      docketEntries: [],
      archivedDocketEntries: [],
      irsPractitioners: [],
      privatePractitioners: [],
      caseStatusHistory: [],
      correspondence: [],
      archivedCorrespondences: [],
      hearings: [],
    });
  });
  statistics.forEach(s => {
    const caseInfo = caseMap.get(s.docketNumber)!;
    const statistics = caseInfo.statistics ?? [];
    statistics.push(s);
    caseMap.set(s.docketNumber, { ...caseInfo, statistics });
  });
  docketEntriesFromDb.forEach(docketEntryInfo => {
    const caseInfo = caseMap.get(docketEntryInfo.docketNumber)!;
    caseMap.set(docketEntryInfo.docketNumber, {
      ...caseInfo,
      docketEntries: docketEntryInfo.docketEntries,
    });
  });
  practitionerInfo.forEach(info => {
    const caseInfo = caseMap.get(info.docketNumber)!;
    caseMap.set(info.docketNumber, {
      ...caseInfo,
      irsPractitioners: info.irsPractitioners,
      privatePractitioners: info.privatePractitioners,
    });
  });
  caseStatusHistories.forEach(history => {
    const caseInfo = caseMap.get(history.docketNumber)!;
    const histories = caseInfo.caseStatusHistory ?? [];
    histories.push(history);
    caseMap.set(history.docketNumber, {
      ...caseInfo,
      caseStatusHistory: histories,
    });
  });
  caseCorrespondences.forEach(correspondence => {
    const caseInfo = caseMap.get(correspondence.docketNumber!)!;
    const correspondences = caseInfo.correspondence ?? [];
    correspondences.push(correspondence);
    caseMap.set(correspondence.docketNumber!, {
      ...caseInfo,
      correspondence: correspondences,
    });
  });
  hearings.forEach(hearingInfo => {
    const caseInfo = caseMap.get(hearingInfo.docketNumber)!;
    caseMap.set(hearingInfo.docketNumber, {
      ...caseInfo,
      hearings: hearingInfo.hearings,
    });
  });

  return Array.from(caseMap.values());
}

function sortCaseFields({
  cases,
  docketNumbers,
}: {
  cases: EnrichedCaseRow[];
  docketNumbers: string[];
}): EnrichedCaseRow[] {
  cases.forEach(c => {
    const [docketEntries, archivedDocketEntries] = partition(
      c.docketEntries,
      docketEntry => !docketEntry.archived,
    );
    c.docketEntries = sortBy(docketEntries, 'createdAt');
    c.archivedDocketEntries = sortBy(archivedDocketEntries, 'createdAt');

    const [correspondence, archivedCorrespondences] = partition(
      c.correspondence,
      correspondenceItem => !correspondenceItem.archived,
    );
    c.correspondence = sortBy(correspondence, 'filingDate');
    c.archivedCorrespondences = sortBy(archivedCorrespondences, 'filingDate');
    c.statistics = sortStatistics(c.statistics);
  });

  // Sort the cases in the original docketNumber order
  const orderObj = {};
  docketNumbers.forEach((num, idx) => {
    orderObj[num] = idx;
  });
  cases.sort((a, b) => {
    return orderObj[a.docketNumber] - orderObj[b.docketNumber];
  });

  return cases;
}

function convertDbCaseToRawCase(
  dbCase: EnrichedCaseRow,
): Omit<RawCase, 'consolidatedCases'> {
  const appCase = {
    ...fromKyselyCase(dbCase),
    statistics: dbCase.statistics.map(s => ({
      ...s,
      penalties: (s.penalties as RawPenalty[]) ?? [],
      year: s.year?.toString(),
      yearOrPeriod: s.yearOrPeriod ?? undefined,
      determinationTotalPenalties: s.determinationTotalPenalties ?? undefined,
      determinationDeficiencyAmount:
        s.determinationDeficiencyAmount ?? undefined,
      lastDateOfPeriod: s.lastDateOfPeriod?.toISOString(),
    })),
    correspondence: dbCase.correspondence.map(cc =>
      caseCorrespondenceEntity(cc),
    ),
    archivedCorrespondences: dbCase.archivedCorrespondences?.map(cc =>
      caseCorrespondenceEntity(cc),
    ),
    caseStatusHistory: dbCase.caseStatusHistory.map(update => {
      return { ...update, date: update.date.toISOString() };
    }),
  };

  return purgeDynamoKeys(appCase);
}

async function getCasesMetadata(docketNumbers: string[]) {
  const caseInfo = await getDbReader(db =>
    db
      .selectFrom('dwCase')
      .where('docketNumber', 'in', docketNumbers)
      .selectAll()
      .execute(),
  );
  return caseInfo;
}

async function getStatistics(docketNumbers: string[]) {
  const dbStatistics = await getDbReader(cb =>
    cb
      .selectFrom('dwCaseStatistic as cs')
      .where('docketNumber', 'in', docketNumbers)
      .leftJoin('dwStatisticPenalty as sp', 'sp.statisticId', 'cs.statisticId')
      .selectAll('cs')
      .select(
        sql`jsonb_agg(to_jsonb(sp) ORDER BY sp.updated_at)`.as('penalties'),
      )
      .groupBy(['cs.docketNumber', 'cs.statisticId'])
      .execute(),
  );
  return dbStatistics.map(s => ({
    ...s,
    penalties: (s.penalties as StatisticPenaltyKysely[]) ?? [],
  }));
}

async function getPractitioners(
  docketNumbers: string[],
  applicationContext,
): Promise<
  {
    docketNumber: string;
    irsPractitioners: any[];
    privatePractitioners: any[];
  }[]
> {
  const practitionerInfo = await Promise.all(
    docketNumbers.map(async docketNumber => {
      const privatePractitioners = await getPrivatePractitionersOnCase({
        docketNumber,
        applicationContext,
      });

      const irsPractitioners = await getIrsPractitionersOnCase({
        applicationContext,
        docketNumber,
      });

      return {
        docketNumber,
        irsPractitioners,
        privatePractitioners,
      };
    }),
  );

  return practitionerInfo;
}

async function getDocketEntries(
  docketNumbers: string[],
  applicationContext,
): Promise<{ docketNumber: string; docketEntries: RawDocketEntry[] }[]> {
  const docketEntryInfo = await Promise.all(
    docketNumbers.map(async docketNumber => {
      const docketEntries = await getDocketEntryOnCase({
        applicationContext,
        docketNumber,
      });
      return { docketNumber, docketEntries };
    }),
  );
  return docketEntryInfo;
}

async function getCasesStatusHistory(docketNumbers: string[]) {
  const dbCaseStatusHistory = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseStatusUpdate')
      .where('docketNumber', 'in', docketNumbers)
      .orderBy('date', 'asc')
      .selectAll()
      .execute(),
  );

  return dbCaseStatusHistory;
}

async function getCaseCorrespondenceByDocketNumber(docketNumbers: string[]) {
  const correspondence = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseCorrespondence as cc')
      .where('cc.docketNumber', 'in', docketNumbers)
      .selectAll()
      .select('cc.docketNumber')
      .execute(),
  );
  return correspondence;
}

async function getHearings(
  docketNumbers: string[],
): Promise<{ docketNumber: string; hearings: any[] }[]> {
  const hearingsInfo = await Promise.all(
    docketNumbers.map(async docketNumber => {
      const hearings = await queryFull({
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
        ExpressionAttributeValues: {
          ':pk': `case|${docketNumber}`,
          ':prefix': 'hearing|',
        },
        KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
        applicationContext,
      });
      return { docketNumber, hearings };
    }),
  );

  return hearingsInfo;
}

type EnrichedCaseRow = CaseKysely & {
  docketNumberWithSuffix: string;
  statistics: (CaseStatisticKysely & { penalties: StatisticPenaltyKysely[] })[];
  docketEntries: RawDocketEntry[];
  archivedDocketEntries: RawDocketEntry[];
  irsPractitioners: RawPractitioner[];
  privatePractitioners: RawPractitioner[];
  caseStatusHistory: CaseStatusUpdateKysely[];
  correspondence: CaseCorrespondenceKysely[];
  archivedCorrespondences: CaseCorrespondenceKysely[];
  hearings: any[];
};
