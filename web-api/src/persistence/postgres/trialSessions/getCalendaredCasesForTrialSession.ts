import { TCaseOrder } from '@shared/business/entities/trialSessions/TrialSession';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { getTrialSessionById } from './getTrialSessionById';
import { NotFoundError } from '@web-api/errors/errors';

export type RawCaseAndCaseOrder = Omit<RawCase, 'consolidatedCases'> &
  TCaseOrder;

export const getCalendaredCasesForTrialSession = async ({
  trialSessionId,
}: {
  trialSessionId: string;
}): Promise<RawCaseAndCaseOrder[]> => {
  const trialSession = await getTrialSessionById({ trialSessionId });

  if (!trialSession) {
    throw new NotFoundError(
      `Could not find trial session with id ${trialSessionId}`,
    );
  }

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
