import { ServerApplicationContext } from '@web-api/applicationContext';
import { TCaseOrder } from '@shared/business/entities/trialSessions/TrialSession';
import { get } from '../../dynamodbClientService';
import { map } from 'lodash';
import { getPrivatePractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getPrivatePractitionersOnCase';
import { getIrsPractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getIrsPractitionersOnCase';
import { getDbReader } from '@web-api/database';
import { getDocketEntryOnCase } from '@web-api/persistence/dynamo/cases/getDocketEntryOnCase';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';

export const getCalendaredCasesForTrialSession = async ({
  applicationContext,
  trialSessionId,
}: {
  applicationContext: ServerApplicationContext;
  trialSessionId: string;
}): Promise<
  (Omit<RawCase, 'caseStatusHistory' | 'correspondence' | 'statistics'> &
    TCaseOrder)[]
> => {
  const trialSession = await getTrialSessionInfo(
    trialSessionId,
    applicationContext,
  );

  const { caseOrder } = trialSession;
  const docketNumbers = map(caseOrder, 'docketNumber');

  const [cases, practitionerInfo, docketEntriesFromDb] = await Promise.all([
    getCases(docketNumbers),
    getPractitioners(docketNumbers, applicationContext),
    getDocketEntries(docketNumbers, applicationContext),
  ]);

  const caseMap: Map<string, any> = new Map();
  cases.forEach(c => {
    caseMap.set(c.docketNumber, { ...c });
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

  return Array.from(caseMap.values());
};

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

async function getCases(docketNumbers: string[]) {
  const caseInfo = await getDbReader(db =>
    db
      .selectFrom('dwCase')
      .where('docketNumber', 'in', docketNumbers)
      .selectAll()
      .execute(),
  );
  return caseInfo.map(c => fromKyselyCase(c));
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
