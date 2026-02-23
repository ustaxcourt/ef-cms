import { TCaseOrder } from '@shared/business/entities/trialSessions/TrialSession';
import {
  OmittableCaseFields,
  getCasesByDocketNumbers,
} from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { getTrialSessionById } from './getTrialSessionById';
import { NotFoundError } from '@web-api/errors/errors';

export type RawCaseAndCaseOrder<T extends OmittableCaseFields[] = []> = Omit<
  RawCase,
  'consolidatedCases' | T[number]
> &
  TCaseOrder;

export const getCalendaredCasesForTrialSession = async <
  T extends OmittableCaseFields[] = [],
>({
  trialSessionId,
  excludeFields,
}: {
  trialSessionId: string;
  excludeFields?: T;
}): Promise<RawCaseAndCaseOrder<T>[]> => {
  const trialSession = await getTrialSessionById({ trialSessionId });

  if (!trialSession) {
    throw new NotFoundError(
      `Could not find trial session with id ${trialSessionId}`,
    );
  }

  const { caseOrder } = trialSession;
  const docketNumbers = caseOrder.map(co => co.docketNumber);

  const cases = await getCasesByDocketNumbers({ docketNumbers, excludeFields });

  const caseOrderMap: Record<string, TCaseOrder> = caseOrder.reduce(
    (map, order) => {
      map[order.docketNumber] = order;
      return map;
    },
    {} as Record<string, TCaseOrder>,
  );

  const casesAugmented = cases.map(caseItem => {
    const { docketNumber } = caseItem as unknown as { docketNumber: string };
    const order = caseOrderMap[docketNumber];
    return {
      ...caseItem,
      ...(order ?? {}),
    };
  });

  return casesAugmented as RawCaseAndCaseOrder<T>[];
};
