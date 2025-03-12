import { ServerApplicationContext } from '@web-api/applicationContext';
import { TCaseOrder } from '@shared/business/entities/trialSessions/TrialSession';
import { get } from '../../dynamodbClientService';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { map } from 'lodash';

export const getCalendaredCasesForTrialSession = async ({
  applicationContext,
  trialSessionId,
}: {
  applicationContext: ServerApplicationContext;
  trialSessionId: string;
}): Promise<(RawCase & TCaseOrder)[]> => {
  const trialSession = await get({
    Key: {
      pk: `trial-session|${trialSessionId}`,
      sk: `trial-session|${trialSessionId}`,
    },
    applicationContext,
  });

  const { caseOrder } = trialSession;
  const docketNumbers = map(caseOrder, 'docketNumber');

  const casesByDocketNumber = await Promise.all(
    docketNumbers.map(docketNumber =>
      getCaseByDocketNumber({
        applicationContext,
        docketNumber,
        includeConsolidatedCases: false,
      }),
    ),
  );

  return caseOrder.map(order => {
    return {
      ...order,
      ...casesByDocketNumber.find(
        aCase => aCase?.docketNumber === order.docketNumber,
      ),
    };
  });
};
