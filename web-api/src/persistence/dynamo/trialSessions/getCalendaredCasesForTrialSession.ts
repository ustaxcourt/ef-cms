import { ServerApplicationContext } from '@web-api/applicationContext';
import { TCaseOrder } from '@shared/business/entities/trialSessions/TrialSession';
import { get } from '../../dynamodbClientService';
import { map } from 'lodash';
import { getPrivatePractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getPrivatePractitionersOnCase';
import { getIrsPractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getIrsPractitionersOnCase';
import { getDbReader } from '@web-api/database';
import { getDocketEntryOnCase } from '@web-api/persistence/dynamo/cases/getDocketEntryOnCase';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { sql } from 'kysely';
import { Penalty } from '@shared/business/entities/Penalty';
import { PetitionerOnCaseKysely } from '@web-api/persistence/postgres/cases/parties/schema';

export const getCalendaredCasesForTrialSession = async ({
  applicationContext,
  trialSessionId,
}: {
  applicationContext: ServerApplicationContext;
  trialSessionId: string;
}): Promise<
  (Omit<RawCase, 'caseStatusHistory' | 'correspondence'> & TCaseOrder)[]
> => {
  const trialSession = await getTrialSessionInfo(
    trialSessionId,
    applicationContext,
  );

  const { caseOrder } = trialSession;
  const docketNumbers = map(caseOrder, 'docketNumber');

  const [
    cases,
    petitioners,
    statistics,
    practitionerInfo,
    docketEntriesFromDb,
  ] = await Promise.all([
    getCasesMetadata(docketNumbers),
    getPetitioners(docketNumbers),
    getStatistics(docketNumbers),
    getPractitioners(docketNumbers, applicationContext),
    getDocketEntries(docketNumbers, applicationContext),
  ]);

  const caseMap: Map<string, any> = new Map();
  cases.forEach(c => {
    caseMap.set(c.docketNumber, { ...c });
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
  caseOrder.forEach(order => {
    const caseInfo = caseMap.get(order.docketNumber);
    caseMap.set(order.docketNumber, { ...caseInfo, ...order });
  });

  const casesData = Array.from(caseMap.values());
  casesData.forEach(c => {
    c.petitioners?.sort(
      (a: PetitionerOnCaseKysely, b: PetitionerOnCaseKysely) => {
        return a.orderOnCase - b.orderOnCase;
      },
    );
  });

  return casesData;
};

// function sortStatistics(statistics: RawStatistic[]) {
//   statistics?.sort((a, b) => {
//     if (a.year === b.year) {
//       return b.updatedAt.localeCompare(a.updatedAt);
//     }
//     return +a.year - +b.year;
//   });
// }

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
  return caseInfo.map(c => fromKyselyCase(c));
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

async function getTrialSessionInfo(
  trialSessionId: string,
  applicationContext: ServerApplicationContext,
) {
  const trialSession = await get({
    Key: {
      pk: `trial-session|${trialSessionId}`,
      sk: `trial-session|${trialSessionId}`,
    },
    applicationContext,
  });
  return trialSession;
}
