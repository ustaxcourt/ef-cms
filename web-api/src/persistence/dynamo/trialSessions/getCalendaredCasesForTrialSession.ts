import { ServerApplicationContext } from '@web-api/applicationContext';
import { TCaseOrder } from '@shared/business/entities/trialSessions/TrialSession';
import { get } from '../../dynamodbClientService';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

export const getCalendaredCasesForTrialSession = async ({
  applicationContext,
  trialSessionId,
}: {
  applicationContext: ServerApplicationContext;
  trialSessionId: string;
}): Promise<(Omit<RawCase, 'consolidatedCases'> & TCaseOrder)[]> => {
  const trialSession = await getTrialSessionInfo(
    trialSessionId,
    applicationContext,
  );

  const { caseOrder } = trialSession;
  const docketNumbers = caseOrder.map(co => co.docketNumber);

  const cases = await getCasesByDocketNumbers({ docketNumbers });

  const caseOrderMap: Record<string, TCaseOrder> = caseOrder.reduce(
    (map, order) => {
      map[order.docketNumber] = order;
      return map;
    },
    {} as Record<string, TCaseOrder>,
  );

  const casesAugmented = cases.map(caseItem => {
    const order = caseOrderMap[caseItem.docketNumber];
    return {
      ...caseItem,
      ...(order ?? {}),
    };
  });

  return casesAugmented;
};

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
