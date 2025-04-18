import { Case } from '@shared/business/entities/cases/Case';
import { Penalty } from '@shared/business/entities/Penalty';
import { applicationContext } from '@web-api/applicationContext';
import { getDbReader } from '@web-api/database';
import { getDocketEntryOnCase } from '@web-api/persistence/dynamo/cases/getDocketEntryOnCase';
import { getIrsPractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getIrsPractitionersOnCase';
import { getPrivatePractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getPrivatePractitionersOnCase';
import { queryFull } from '@web-api/persistence/dynamodbClientService';
import { caseCorrespondenceEntity } from '@web-api/persistence/postgres/caseCorrespondences/mapper';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { PetitionerOnCaseKysely } from '@web-api/persistence/postgres/cases/parties/schema';
import { sortStatistics } from '@web-api/persistence/postgres/cases/statistics/helper';
import { sql } from 'kysely';
import { isEmpty, partition, sortBy } from 'lodash';

export async function getCasesByDocketNumbers({
  docketNumbers,
}: {
  docketNumbers: string[];
}): Promise<Omit<RawCase, 'hearings'>[]> {
  if (isEmpty(docketNumbers)) {
    return [];
  }

  // Get all the data for all cases in arbitrary order
  const [
    cases,
    petitioners,
    statistics,
    practitionerInfo,
    docketEntriesFromDb,
    caseStatusHistories,
    caseCorrespondences,
    hearings,
  ] = await Promise.all([
    getCasesMetadata(docketNumbers),
    getPetitioners(docketNumbers),
    getStatistics(docketNumbers),
    getPractitioners(docketNumbers, applicationContext),
    getDocketEntries(docketNumbers, applicationContext),
    getCasesStatusHistory(docketNumbers),
    getCaseCorrespondenceByDocketNumber(docketNumbers),
    getHearings(docketNumbers),
  ]);

  // Associate the right data with each case
  const caseMap: Map<string, any> = new Map();
  cases.forEach(c => {
    caseMap.set(c.docketNumber, {
      ...c,
      docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
        docketNumber: c.docketNumber,
        docketNumberSuffix: c.docketNumberSuffix,
      }),
    });
  });
  petitioners.forEach(p => {
    const caseInfo = caseMap.get(p.docketNumber);
    const petitioners = caseInfo.petitioners || [];
    petitioners.push(p);
    caseMap.set(p.docketNumber, { ...caseInfo, petitioners });
  });
  statistics.forEach(s => {
    const caseInfo = caseMap.get(s.docketNumber);
    const statistics = caseInfo.statistics || [];
    statistics.push(s);
    caseMap.set(s.docketNumber, { ...caseInfo, statistics });
  });
  docketEntriesFromDb.forEach(docketEntryInfo => {
    const caseInfo = caseMap.get(docketEntryInfo.docketNumber);
    caseMap.set(docketEntryInfo.docketNumber, {
      ...caseInfo,
      docketEntries: docketEntryInfo.docketEntries,
    });
  });
  practitionerInfo.forEach(info => {
    const caseInfo = caseMap.get(info.docketNumber);
    caseMap.set(info.docketNumber, {
      ...caseInfo,
      irsPractitioners: info.irsPractitioners,
      privatePractitioners: info.privatePractitioners,
    });
  });
  caseStatusHistories.forEach(history => {
    const caseInfo = caseMap.get(history.docketNumber);
    const histories = caseInfo.caseStatusHistory || [];
    histories.push(history);
    caseMap.set(history.docketNumber, {
      ...caseInfo,
      caseStatusHistory: histories,
    });
  });
  caseCorrespondences.forEach(correspondence => {
    const caseInfo = caseMap.get(correspondence.docketNumber!);
    const correspondences = caseInfo.correspondence || [];
    correspondences.push(correspondence);
    caseMap.set(correspondence.docketNumber!, {
      ...caseInfo,
      correspondence: correspondences,
    });
  });
  hearings.forEach(hearingInfo => {
    const caseInfo = caseMap.get(hearingInfo.docketNumber);
    caseMap.set(hearingInfo.docketNumber, {
      ...caseInfo,
      hearings: hearingInfo.hearings,
    });
  });

  // Sort case fields that need to be sorted
  const casesData = Array.from(caseMap.values());
  casesData.forEach(c => {
    c.petitioners?.sort(
      (a: PetitionerOnCaseKysely, b: PetitionerOnCaseKysely) => {
        return a.orderOnCase - b.orderOnCase;
      },
    );
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
  casesData.sort((a, b) => {
    return orderObj[a.docketNumber] - orderObj[b.docketNumber];
  });

  // Map and return the cases
  return casesData.map(c => fromKyselyCase(c)) as RawCase[];
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

async function getPetitioners(docketNumbers: string[]) {
  const dbPetitioners = await getDbReader(cb =>
    cb
      .selectFrom('dwPetitionerOnCase')
      .where('docketNumber', 'in', docketNumbers)
      .selectAll()
      .execute(),
  );
  return dbPetitioners;
}

async function getCasesStatusHistory(docketNumbers: string[]) {
  const dbCaseStatusHistory = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseStatusUpdate')
      .where('docketNumber', 'in', docketNumbers)
      .orderBy('date asc')
      .selectAll()
      .execute(),
  );
  const caseStatusHistory = dbCaseStatusHistory.map(update => {
    return { ...update, date: update.date.toISOString() };
  });

  return caseStatusHistory;
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

  return correspondence.map(c => caseCorrespondenceEntity(c));
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
    penalties: (s.penalties as Penalty[]) || [],
    year: s.year?.toString(),
    yearOrPeriod: s.yearOrPeriod || undefined,
    determinationTotalPenalties: s.determinationTotalPenalties || undefined,
    determinationDeficiencyAmount: s.determinationDeficiencyAmount || undefined,
    lastDateOfPeriod: s.lastDateOfPeriod?.toISOString(),
  }));
}
